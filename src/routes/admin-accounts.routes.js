const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.enum(['MARKETER', 'INSTITUTION'])
});

// POST /api/admin-accounts   (ADMIN only)
// Directly creates a MARKETER or INSTITUTION account with a temporary
// password, returned once so the admin can share it. Unlike TRAINER/
// CONSULTANT, these two roles don't go through the public application
// review flow (they're set up directly by the platform admin, matching
// how a business partnership is normally established).
router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

  const temporaryPassword = crypto.randomBytes(6).toString('base64url');
  const passwordHash = await bcrypt.hash(temporaryPassword, 12);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      passwordHash,
      role: parsed.data.role
    }
  });

  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    temporaryPassword
  });
});

// GET /api/admin-accounts?role=MARKETER|INSTITUTION   (ADMIN only)
router.get('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { role } = req.query;
  const where = role ? { role: String(role) } : { role: { in: ['MARKETER', 'INSTITUTION'] } };
  const users = await prisma.user.findMany({
    where,
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ users });
});

module.exports = router;
