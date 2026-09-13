const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

const applicationSchema = z.object({
  name: z.string().min(2),
  nationalId: z.string().regex(/^\d{10}$/, 'Must be a 10-digit national ID / iqama number'),
  phone: z.string().min(6),
  email: z.string().email().optional(),
  appliedRole: z.enum(['TRAINER', 'CONSULTANT']),
  bio: z.string().min(20),
  bioAr: z.string().optional(),
  specialization: z.string().min(2),
  portfolioUrl: z.string().url().optional()
});

// POST /api/applications   (public — no login required, matches how a
// real "join us as a trainer / consultant" marketplace form works)
router.post('/', async (req, res) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existingUser = await prisma.user.findUnique({ where: { nationalId: parsed.data.nationalId } });
  if (existingUser) return res.status(409).json({ error: 'An account with this national ID already exists' });

  const application = await prisma.providerApplication.create({ data: parsed.data });
  res.status(201).json({ application: { id: application.id, status: application.status } });
});

// GET /api/applications   (admin only) — ?status=pending|approved|rejected
router.get('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { status } = req.query;
  const applications = await prisma.providerApplication.findMany({
    where: status ? { status: String(status) } : {},
    orderBy: { createdAt: 'desc' }
  });
  res.json({ applications });
});

// POST /api/applications/:id/approve   (admin only)
// Creates the User account (TRAINER or CONSULTANT) with a randomly
// generated temporary password, returned once in the response so the
// admin can share it with the applicant. In production, email it
// instead of returning it in the API response.
router.post('/:id/approve', authenticate, requireRole('ADMIN'), async (req, res) => {
  const application = await prisma.providerApplication.findUnique({ where: { id: req.params.id } });
  if (!application) return res.status(404).json({ error: 'Application not found' });
  if (application.status !== 'pending') return res.status(400).json({ error: 'Application already reviewed' });

  const tempPassword = crypto.randomBytes(6).toString('base64url');
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const user = await prisma.user.create({
    data: {
      nationalId: application.nationalId,
      name: application.name,
      phone: application.phone,
      passwordHash,
      role: application.appliedRole
    }
  });

  await prisma.providerApplication.update({
    where: { id: application.id },
    data: { status: 'approved', reviewedAt: new Date() }
  });

  res.json({
    user: { id: user.id, name: user.name, nationalId: user.nationalId, role: user.role },
    temporaryPassword: tempPassword
  });
});

// POST /api/applications/:id/reject   (admin only)   { note? }
router.post('/:id/reject', authenticate, requireRole('ADMIN'), async (req, res) => {
  const application = await prisma.providerApplication.findUnique({ where: { id: req.params.id } });
  if (!application) return res.status(404).json({ error: 'Application not found' });
  if (application.status !== 'pending') return res.status(400).json({ error: 'Application already reviewed' });

  const updated = await prisma.providerApplication.update({
    where: { id: application.id },
    data: { status: 'rejected', reviewedAt: new Date(), reviewNote: req.body.note || null }
  });
  res.json({ application: updated });
});

module.exports = router;
