const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');
const mailer = require('../lib/mailer');

const router = express.Router();

// GET /api/consulting-services?category=   (public)
router.get('/services', async (req, res) => {
  const { category } = req.query;
  const services = await prisma.consultingService.findMany({
    where: {
      active: true,
      ...(category && category !== 'All' ? { category: String(category) } : {})
    },
    include: { consultant: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ services });
});

const serviceSchema = z.object({
  title: z.string().min(2),
  titleAr: z.string().optional(),
  category: z.string().min(2),
  categoryEn: z.string().optional(),
  description: z.string().min(10),
  descriptionAr: z.string().optional()
});

// POST /api/consulting-services   (consultant or admin — consultant becomes the owner)
router.post('/services', authenticate, requireRole('CONSULTANT', 'ADMIN', 'TRAINER'), async (req, res) => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const service = await prisma.consultingService.create({
    data: { ...parsed.data, consultantId: req.user.sub }
  });
  res.status(201).json({ service });
});

// PATCH /api/consulting-services/:id   (owning consultant, or admin)
router.patch('/services/:id', authenticate, requireRole('CONSULTANT', 'ADMIN', 'TRAINER'), async (req, res) => {
  const service = await prisma.consultingService.findUnique({ where: { id: req.params.id } });
  if (!service) return res.status(404).json({ error: 'Service not found' });
  if (req.user.role !== 'ADMIN' && service.consultantId !== req.user.sub) {
    return res.status(403).json({ error: 'You can only edit your own services' });
  }
  const parsed = serviceSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await prisma.consultingService.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ service: updated });
});

// DELETE /api/consulting-services/:id   (owning consultant, or admin)
router.delete('/services/:id', authenticate, requireRole('CONSULTANT', 'ADMIN', 'TRAINER'), async (req, res) => {
  const service = await prisma.consultingService.findUnique({ where: { id: req.params.id } });
  if (!service) return res.status(404).json({ error: 'Service not found' });
  if (req.user.role !== 'ADMIN' && service.consultantId !== req.user.sub) {
    return res.status(403).json({ error: 'You can only delete your own services' });
  }
  await prisma.consultingService.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

const requestSchema = z.object({
  serviceId: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(5)
});

// POST /api/consulting-requests   (public — no login required; the
// inquirer is often a company contact, not a registered trainee)
router.post('/requests', async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const service = await prisma.consultingService.findUnique({ where: { id: parsed.data.serviceId } });
  if (!service) return res.status(404).json({ error: 'Service not found' });

  const request = await prisma.consultingRequest.create({ data: parsed.data });

  mailer.notify(
    `New consulting inquiry: ${service.title}`,
    `Service: ${service.title} (${service.titleAr || ''})\n\nName: ${parsed.data.name}\nEmail: ${parsed.data.email}\nPhone: ${parsed.data.phone || '-'}\nCompany: ${parsed.data.company || '-'}\n\nMessage:\n${parsed.data.message}`
  );

  res.status(201).json({ request: { id: request.id, status: request.status } });
});

// GET /api/consulting-requests   (the owning consultant sees their own leads; admin sees all)
router.get('/requests', authenticate, requireRole('CONSULTANT', 'ADMIN', 'TRAINER'), async (req, res) => {
  const requests = await prisma.consultingRequest.findMany({
    where: req.user.role === 'ADMIN' ? {} : { service: { consultantId: req.user.sub } },
    include: { service: { select: { title: true, titleAr: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ requests });
});

// PATCH /api/consulting-requests/:id   { status }   (owning consultant, or admin)
router.patch('/requests/:id', authenticate, requireRole('CONSULTANT', 'ADMIN', 'TRAINER'), async (req, res) => {
  const request = await prisma.consultingRequest.findUnique({ where: { id: req.params.id }, include: { service: true } });
  if (!request) return res.status(404).json({ error: 'Request not found' });
  if (req.user.role !== 'ADMIN' && request.service.consultantId !== req.user.sub) {
    return res.status(403).json({ error: 'You can only manage your own leads' });
  }
  if (!['new', 'contacted', 'closed'].includes(req.body.status)) {
    return res.status(400).json({ error: 'status must be new, contacted, or closed' });
  }
  const updated = await prisma.consultingRequest.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  res.json({ request: updated });
});

module.exports = router;
