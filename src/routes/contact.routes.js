const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');
const mailer = require('../lib/mailer');

const router = express.Router();

const messageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9, 'Phone number is required'),
  subject: z.string().optional(),
  message: z.string().min(5)
});

// POST /api/contact   (public — no login required)
router.post('/', async (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const contactMessage = await prisma.contactMessage.create({ data: parsed.data });

  mailer.notify(
    `New contact message from ${contactMessage.name}`,
    `Name: ${contactMessage.name}\nEmail: ${contactMessage.email}\nPhone: ${contactMessage.phone || '-'}\nSubject: ${contactMessage.subject || '-'}\n\nMessage:\n${contactMessage.message}`
  );

  res.status(201).json({ message: { id: contactMessage.id, status: contactMessage.status } });
});

// GET /api/contact   (admin only)
router.get('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ messages });
});

// PATCH /api/contact/:id   { status }   (admin only)
router.patch('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  if (!['new', 'read', 'closed'].includes(req.body.status)) {
    return res.status(400).json({ error: 'status must be new, read, or closed' });
  }
  const contactMessage = await prisma.contactMessage.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  res.json({ message: contactMessage });
});

module.exports = router;
