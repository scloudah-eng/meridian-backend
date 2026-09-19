const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/corporate-packages   (public)
router.get('/', async (req, res) => {
  const packages = await prisma.corporatePackage.findMany({ where: { active: true }, orderBy: { createdAt: 'asc' } });
  res.json({ packages });
});

const packageSchema = z.object({
  tier: z.string().min(2),
  name: z.string().min(2),
  nameAr: z.string().optional(),
  description: z.string().min(5),
  descriptionAr: z.string().optional(),
  seatsIncluded: z.number().int().nullable().optional(),
  priceFrom: z.number().positive().nullable().optional()
});

// POST /api/corporate-packages   (admin only)
router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  const parsed = packageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const pkg = await prisma.corporatePackage.create({ data: parsed.data });
  res.status(201).json({ package: pkg });
});

// PATCH /api/corporate-packages/:id   (admin only)
router.patch('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  const parsed = packageSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const pkg = await prisma.corporatePackage.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ package: pkg });
});

const inquirySchema = z.object({
  packageId: z.string(),
  companyName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9, 'Phone number is required'),
  seats: z.number().int().positive().optional(),
  message: z.string().min(5)
});

// POST /api/corporate-packages/inquiries   (public — no login required)
router.post('/inquiries', async (req, res) => {
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const pkg = await prisma.corporatePackage.findUnique({ where: { id: parsed.data.packageId } });
  if (!pkg) return res.status(404).json({ error: 'Package not found' });

  const inquiry = await prisma.corporatePackageInquiry.create({ data: parsed.data });
  res.status(201).json({ inquiry: { id: inquiry.id, status: inquiry.status } });
});

// GET /api/corporate-packages/inquiries   (admin only)
router.get('/inquiries', authenticate, requireRole('ADMIN'), async (req, res) => {
  const inquiries = await prisma.corporatePackageInquiry.findMany({
    include: { package: { select: { name: true, nameAr: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ inquiries });
});

// PATCH /api/corporate-packages/inquiries/:id   { status }   (admin only)
router.patch('/inquiries/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  if (!['new', 'contacted', 'closed'].includes(req.body.status)) {
    return res.status(400).json({ error: 'status must be new, contacted, or closed' });
  }
  const inquiry = await prisma.corporatePackageInquiry.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  res.json({ inquiry });
});

module.exports = router;
