const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');
const mailer = require('../lib/mailer');

const router = express.Router();

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  wantsConsulting: z.boolean().optional(),
  wantsTraining: z.boolean().optional(),
  message: z.string().min(5)
});

// POST /api/combined-inquiry   (public)
//
// A single lead-capture form for prospects who want both a consulting
// engagement (SCL) and staff training (Mada Alhyat) together. This is
// intentionally NOT tied to one ConsultingService or Course record —
// it's a general "we need the integrated solution" inquiry that an
// admin triages and routes to the right team(s) manually, keeping the
// two entities' separate invoicing/contracts intact behind the scenes.
//
// Persisted to the database (not just emailed) so it's never lost if
// mail delivery fails — see GET /api/admin/messages for the unified
// inbox that surfaces this alongside every other inquiry type.
router.post('/', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, email, phone, company, wantsConsulting, wantsTraining, message } = parsed.data;

  const inquiry = await prisma.combinedInquiry.create({
    data: { name, email, phone, company, wantsConsulting: !!wantsConsulting, wantsTraining: !!wantsTraining, message }
  });

  const interests = [
    wantsConsulting ? 'Consulting (SCL)' : null,
    wantsTraining ? 'Training (Mada Alhyat)' : null
  ].filter(Boolean).join(' + ') || 'Not specified';

  mailer.notify(
    `Combined inquiry (Consulting + Training): ${name}`,
    `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nCompany: ${company || '-'}\nInterested in: ${interests}\n\nMessage:\n${message}`
  );

  res.status(201).json({ inquiry, message: 'Inquiry sent — we will be in touch soon.' });
});

// GET /api/combined-inquiry   (admin only) — view submitted inquiries
router.get('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  const inquiries = await prisma.combinedInquiry.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ inquiries });
});

// PATCH /api/combined-inquiry/:id   { status }   (admin only)
router.patch('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { status } = req.body;
  if (!['new', 'contacted', 'closed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const inquiry = await prisma.combinedInquiry.update({ where: { id: req.params.id }, data: { status } });
  res.json({ inquiry });
});

module.exports = router;
