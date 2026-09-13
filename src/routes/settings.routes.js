const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
const SETTINGS_ID = 'platform';

// GET /api/settings   (public — the frontend reads this to render branding)
router.get('/', async (req, res) => {
  const settings = await prisma.platformSettings.findUnique({ where: { id: SETTINGS_ID } });
  res.json({ settings: settings || (await prisma.platformSettings.create({ data: { id: SETTINGS_ID } })) });
});

const settingsSchema = z.object({
  siteName: z.string().min(1).optional(),
  siteNameAr: z.string().min(1).optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a hex color like #8A6A34').optional()
});

// PATCH /api/settings   (admin only)
router.patch('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const settings = await prisma.platformSettings.upsert({
    where: { id: SETTINGS_ID },
    update: parsed.data,
    create: { id: SETTINGS_ID, ...parsed.data }
  });
  res.json({ settings });
});

module.exports = router;
