const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const registerSchema = z.object({
  nationalId: z.string().regex(/^\d{10}$/, 'Must be a 10-digit national ID / iqama number'),
  name: z.string().min(2),
  phone: z.string().optional(),
  password: z.string().min(8)
});

// POST /api/auth/register
//
// SECURITY NOTE: this route always creates a TRAINEE account. An earlier
// version of this route accepted a `role` field from the request body
// and trusted it directly — meaning anyone could self-register as ADMIN.
// That has been removed. TRAINER and CONSULTANT accounts can now only be
// created by an admin approving a ProviderApplication (see
// applications.routes.js) — there is no other path to those roles.
//
// This is LOCAL demo authentication: a national ID plus a password you
// choose here. It exists so the API is fully testable on its own.
//
// For real Saudi accreditation, replace this with the official Nafath
// OAuth 2.0 / OIDC login flow instead: the user is redirected to Nafath,
// approves the request in the Nafath app, and Nafath redirects back with
// a verified national ID and name — at that point you create/find the
// User record WITHOUT ever collecting or storing a password. Getting
// production Nafath credentials requires a direct agreement with the
// National Information Center; see README.md "Nafath integration".
router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { nationalId, name, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { nationalId } });
  if (existing) return res.status(409).json({ error: 'An account with this national ID already exists' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { nationalId, name, phone, passwordHash, role: 'TRAINEE' }
  });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

const loginSchema = z.object({
  nationalId: z.string(),
  password: z.string()
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { nationalId, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { nationalId } });
  if (!user) return res.status(401).json({ error: 'Invalid national ID or password' });

  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) return res.status(401).json({ error: 'Invalid national ID or password' });

  res.json({ token: signToken(user), user: publicUser(user) });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: publicUser(user) });
});

function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, nationalId: user.nationalId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function publicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

module.exports = router;
