const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
  sclLogoUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a hex color like #8A6A34').optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  addressRiyadh: z.string().optional(),
  addressRiyadhAr: z.string().optional(),
  addressCairo: z.string().optional(),
  addressCairoAr: z.string().optional(),
  taxNumber: z.string().optional(),
  crNumber: z.string().optional(),
  socialLinkedin: z.string().optional(),
  socialTwitter: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialFacebook: z.string().optional(),
  sclCompanyName: z.string().optional(),
  sclCompanyNameAr: z.string().optional(),
  sclTaxNumber: z.string().optional(),
  sclCrNumber: z.string().optional(),
  visionEn: z.string().optional(),
  visionAr: z.string().optional(),
  missionEn: z.string().optional(),
  missionAr: z.string().optional()
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

// ---------------------------------------------------------------------
// Logo upload — lets a non-technical admin replace the logo by picking
// a file, instead of needing to paste a hosted image URL.
// ---------------------------------------------------------------------
const logoUploadDir = path.join(__dirname, '..', '..', 'uploads', 'branding');
fs.mkdirSync(logoUploadDir, { recursive: true });

const logoStorage = multer.diskStorage({
  destination: logoUploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `logo-${Date.now()}${ext}`);
  }
});
const logoUpload = multer({
  storage: logoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB — a logo should never need more
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are accepted'));
    cb(null, true);
  }
});

// POST /api/settings/logo   (multipart/form-data, field "logo")   (admin only)
router.post('/logo', authenticate, requireRole('ADMIN'), logoUpload.single('logo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file received (field name must be "logo")' });

  const logoUrl = `/uploads/branding/${req.file.filename}`;
  const settings = await prisma.platformSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { logoUrl },
    create: { id: SETTINGS_ID, logoUrl }
  });
  res.json({ settings });
});

// POST /api/settings/scl-logo   (multipart/form-data, field "logo")   (admin only)
// A separate logo for the Smart Compliance Leap (SCL) brand, shown
// alongside consulting services and business solutions listings —
// distinct from the main Mada Alhyat logo.
router.post('/scl-logo', authenticate, requireRole('ADMIN'), logoUpload.single('logo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file received (field name must be "logo")' });

  const sclLogoUrl = `/uploads/branding/${req.file.filename}`;
  const settings = await prisma.platformSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { sclLogoUrl },
    create: { id: SETTINGS_ID, sclLogoUrl }
  });
  res.json({ settings });
});

module.exports = router;
