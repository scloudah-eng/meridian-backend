const express = require('express');
const { z } = require('zod');
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
router.post('/', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, email, phone, company, wantsConsulting, wantsTraining, message } = parsed.data;

  const interests = [
    wantsConsulting ? 'Consulting (SCL)' : null,
    wantsTraining ? 'Training (Mada Alhyat)' : null
  ].filter(Boolean).join(' + ') || 'Not specified';

  mailer.notify(
    `Combined inquiry (Consulting + Training): ${name}`,
    `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nCompany: ${company || '-'}\nInterested in: ${interests}\n\nMessage:\n${message}`
  );

  res.status(201).json({ message: 'Inquiry sent — we will be in touch soon.' });
});

module.exports = router;
