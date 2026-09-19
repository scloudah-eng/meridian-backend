const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');
const mailer = require('../lib/mailer');

const router = express.Router();

// Stricter than the global rate limit — login attempts are the main
// brute-force target, so this caps them at 10 tries per 15 minutes per
// IP, independent of the account being targeted (keyed by IP, not
// email, so it can't be used to enumerate whether an email exists).
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in a few minutes.' }
});

const registerSchema = z.object({
  role: z.enum(['TRAINEE', 'MARKETER', 'INSTITUTION']).default('TRAINEE'),
  email: z.string().email(),
  name: z.string().min(2),
  nameEn: z.string().optional(),
  phone: z.string().min(9, 'Phone number is required'),
  whatsapp: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  socialLinks: z.string().optional(),
  academicSpecialization: z.string().optional(),
  academicSpecializationAr: z.string().optional(),
  wantsMarketingIncome: z.boolean().optional(),
  referralCode: z.string().optional(), // a code the new user was referred by — separate from role-based referralCode below
  password: z.string().min(8)
});

// POST /api/auth/register
//
// SECURITY NOTE: this route only ever creates TRAINEE, MARKETER, or
// INSTITUTION accounts directly from the role field — those are the
// self-service roles. TRAINER and CONSULTANT accounts can never be
// created here: they must go through an admin approving a
// ProviderApplication (see applications.routes.js), because those roles
// deliver paid courses/consulting and carry real reputational and
// financial trust — instant self-service signup for them would let
// anyone claim to be a vetted trainer. ADMIN is never reachable from
// any registration path.
//
// Login identifier: email + password you choose here. (This platform
// previously used the Saudi national ID as the login identifier, kept
// as an optional profile field — see nationalId — for a possible future
// Nafath integration, but email is the identifier used to log in.)
router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, name, password, referralCode, ...profileFields } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name, passwordHash, ...profileFields }
  });

  if (profileFields.wantsMarketingIncome) {
    mailer.notify(
      'New sign-up interested in marketing income',
      `${user.name} (${user.email}, role: ${user.role}) checked "interested in additional income through marketing" at registration. Consider following up about the marketer program.`
    );
  }

  mailer.sendTo(
    user.email,
    'Welcome to Mada Alhyat Training Center',
    `Hello ${user.name},\n\nWelcome! Your account has been created successfully.\n\nYou can now log in at ${process.env.PUBLIC_SITE_URL || 'https://app.lltc.sa'} using this email address and the password you chose.\n\nIf you have any questions, reach us at info@lltc.sa or +966 561 919 110.\n\nWishing you a great learning journey,\nMada Alhyat Training Center`
  );

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.deletedAt) return res.status(401).json({ error: 'Invalid email or password' });

  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) return res.status(401).json({ error: 'Invalid email or password' });

  res.json({ token: signToken(user), user: publicUser(user) });
});

const forgotSchema = z.object({ email: z.string().email() });

// POST /api/auth/forgot-password   { email }
// Always responds the same way whether or not the email exists, so this
// endpoint can never be used to check which emails are registered.
router.post('/forgot-password', loginLimiter, async (req, res) => {
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

// DELETE /api/auth/me   { password }
// Self-service account deletion, required for password confirmation so a
// hijacked session can't be used to delete the account silently. This is
// a soft delete: personal fields are anonymized and the account can no
// longer log in, but payment/enrollment/certificate records are kept
// intact (unmodified) since they're financial and academic records the
// business needs to retain — only the identifying fields on User change.
router.delete('/me', authenticate, async (req, res) => {
  const { password } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
  if (!user || user.deletedAt) return res.status(404).json({ error: 'Account not found' });

  const passwordOk = password && await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) return res.status(401).json({ error: 'Incorrect password' });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      deletedAt: new Date(),
      name: 'Deleted user',
      nameEn: null,
      email: `deleted-${user.id}@deleted.lltc.sa`,
      nationalId: null,
      phone: null,
      whatsapp: null,
      nationality: null,
      address: null,
      socialLinks: null,
      photoUrl: null,
      bio: null,
      bioAr: null,
      referralCode: null
    }
  });
  res.status(204).send();
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
