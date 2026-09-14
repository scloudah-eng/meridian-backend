const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/business-solutions?category=   (public)
router.get('/', async (req, res) => {
  const { category } = req.query;
  const solutions = await prisma.businessSolution.findMany({
    where: {
      active: true,
      ...(category && category !== 'All' ? { category: String(category) } : {})
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ solutions });
});

const solutionSchema = z.object({
  title: z.string().min(2),
  titleAr: z.string().optional(),
  category: z.string().min(2),
  categoryEn: z.string().optional(),
  description: z.string().min(10),
  descriptionAr: z.string().optional(),
  partnerBrand: z.string().optional()
});

// POST /api/business-solutions   (admin only — company-wide catalog)
router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  const parsed = solutionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const solution = await prisma.businessSolution.create({ data: parsed.data });
  res.status(201).json({ solution });
});

// PATCH /api/business-solutions/:id   (admin only)
router.patch('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  const parsed = solutionSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const solution = await prisma.businessSolution.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ solution });
});

// DELETE /api/business-solutions/:id   (admin only)
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  await prisma.businessSolution.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

const requestSchema = z.object({
  solutionId: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(5)
});

// POST /api/business-solutions/requests   (public — no login required)
router.post('/requests', async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const solution = await prisma.businessSolution.findUnique({ where: { id: parsed.data.solutionId } });
  if (!solution) return res.status(404).json({ error: 'Solution not found' });

  const request = await prisma.businessSolutionRequest.create({ data: parsed.data });
  res.status(201).json({ request: { id: request.id, status: request.status } });
});

// GET /api/business-solutions/requests   (admin only)
router.get('/requests', authenticate, requireRole('ADMIN'), async (req, res) => {
  const requests = await prisma.businessSolutionRequest.findMany({
    include: { solution: { select: { title: true, titleAr: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ requests });
});

// PATCH /api/business-solutions/requests/:id   { status }   (admin only)
router.patch('/requests/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  if (!['new', 'contacted', 'closed'].includes(req.body.status)) {
    return res.status(400).json({ error: 'status must be new, contacted, or closed' });
  }
  const request = await prisma.businessSolutionRequest.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  res.json({ request });
});

module.exports = router;
