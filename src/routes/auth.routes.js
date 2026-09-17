const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');
const mailer = require('../lib/mailer');

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().optional(),
  password: z.string().min(8)
});

// POST /api/auth/register
//
// SECURITY NOTE: this route always creates a TRAINEE account. TRAINER
// and CONSULTANT accounts can only be created by an admin approving a
// ProviderApplication; MARKETER and INSTITUTION accounts can only be
// created directly by an admin (see applications.routes.js and
// admin-accounts.routes.js). There is no other path to those roles.
//
// Login identifier: email + password you choose here. (This platform
// previously used the Saudi national ID as the login identifier, kept
// as an optional profile field — see nationalId — for a possible future
// Nafath integration, but email is the identifier used to log in.)
router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, name, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name, phone, passwordHash, role: 'TRAINEE' }
  });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) return res.status(401).json({ error: 'Invalid email or password' });

  res.json({ token: signToken(user), user: publicUser(user) });
});

const forgotSchema = z.object({ email: z.string().email() });

// POST /api/auth/forgot-password   { email }
// Always responds the same way whether or not the email exists, so this
// endpoint can never be used to check which emails are registered.
router.post('/forgot-password', async (req, res) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await prisma.passwordReset.create({ data: { userId: user.id, token, expiresAt } });

    const resetUrl = `${process.env.PUBLIC_SITE_URL || 'https://app.lltc.sa'}/?resetToken=${token}`;
    mailer.notify(
      `Password reset requested`,
      `A password reset was requested for ${user.email}.\n\nReset link (valid 1 hour): ${resetUrl}\n\nIf this wasn't you, ignore this message — your password will not change.`
    );
    // Also try sending directly to the user, not just the platform inbox,
    // so they actually receive their own reset link.
    mailer.sendTo(
      user.email,
      'Reset your password',
      `Hello ${user.name},\n\nUse this link to reset your password (valid for 1 hour):\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`
    );
  }

  res.json({ message: 'If that email is registered, a reset link has been sent.' });
});

const resetSchema = z.object({ token: z.string(), newPassword: z.string().min(8) });

// POST /api/auth/reset-password   { token, newPassword }
router.post('/reset-password', async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const reset = await prisma.passwordReset.findUnique({ where: { token: parsed.data.token } });
  if (!reset || reset.used || reset.expiresAt < new Date()) {
    return res.status(400).json({ error: 'This reset link is invalid or has expired.' });
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.$transaction([
    prisma.user.update({ where: { id: reset.userId }, data: { passwordHash } }),
    prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } })
  ]);

  res.json({ message: 'Password updated — you can now log in with your new password.' });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: publicUser(user) });
});

function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function publicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

module.exports = router;
