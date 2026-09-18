const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/bank-accounts   (public — the footer reads this)
router.get('/', async (req, res) => {
  const accounts = await prisma.bankAccount.findMany({ orderBy: { order: 'asc' } });
  res.json({ accounts });
});

const accountSchema = z.object({
  label: z.string().min(2),
  labelAr: z.string().optional(),
  bankName: z.string().min(2),
  accountName: z.string().min(2),
  iban: z.string().min(5),
  swift: z.string().optional(),
  order: z.number().int().optional()
});

// POST /api/bank-accounts   (admin only)
router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  const parsed = accountSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const account = await prisma.bankAccount.create({ data: parsed.data });
  res.status(201).json({ account });
});

// PATCH /api/bank-accounts/:id   (admin only)
router.patch('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  const parsed = accountSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const account = await prisma.bankAccount.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ account });
});

// DELETE /api/bank-accounts/:id   (admin only)
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  await prisma.bankAccount.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

module.exports = router;
