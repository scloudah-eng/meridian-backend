const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// ---------------------------------------------------------------------
// File uploads — applicant photo (image) and CV/certificates (PDF or
// Office document). Two separate multer fields on the same request.
// ---------------------------------------------------------------------
const appUploadDir = path.join(__dirname, '..', '..', 'uploads', 'applications');
fs.mkdirSync(appUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: appUploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    cb(null, `${file.fieldname}-${safeBase}-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB — covers a real CV with certificates
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'photo') {
      if (!file.mimetype.startsWith('image/')) return cb(new Error('Photo must be an image file'));
      return cb(null, true);
    }
    if (file.fieldname === 'cv') {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!['.pdf', '.doc', '.docx'].includes(ext)) return cb(new Error('CV must be a PDF or Word document'));
      return cb(null, true);
    }
    cb(new Error('Unexpected file field'));
  }
});
const uploadFields = upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'cv', maxCount: 1 }]);

const applicationSchema = z.object({
  name: z.string().min(2),
  nationalId: z.string().regex(/^\d{10}$/, 'Must be a 10-digit national ID / iqama number').optional(),
  phone: z.string().min(6),
  email: z.string().email(),
  nationality: z.string().optional(),
  appliedRole: z.enum(['TRAINER', 'CONSULTANT']),
  bio: z.string().min(20),
  bioAr: z.string().optional(),
  specialization: z.string().min(2),
  specializationAr: z.string().optional(),
  portfolioUrl: z.string().url().optional().or(z.literal(''))
});

// POST /api/applications   (public — no login required)
// multipart/form-data: all applicationSchema fields as text parts, plus
// optional "photo" and "cv" file parts.
router.post('/', uploadFields, async (req, res) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existingUser) return res.status(409).json({ error: 'An account with this email already exists' });

  const photoFile = req.files && req.files.photo && req.files.photo[0];
  const cvFile = req.files && req.files.cv && req.files.cv[0];

  const data = { ...parsed.data };
  if (!data.portfolioUrl) delete data.portfolioUrl;
  if (photoFile) data.photoUrl = `/uploads/applications/${photoFile.filename}`;
  if (cvFile) data.cvUrl = `/uploads/applications/${cvFile.filename}`;

  const application = await prisma.providerApplication.create({ data });
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
// generated temporary password, and carries the application's
// professional details (specialization, bio, photo) straight over into
// the new user's public trainer-profile fields, so an approved
// applicant's profile page is already populated on day one.
router.post('/:id/approve', authenticate, requireRole('ADMIN'), async (req, res) => {
  const application = await prisma.providerApplication.findUnique({ where: { id: req.params.id } });
  if (!application) return res.status(404).json({ error: 'Application not found' });
  if (application.status !== 'pending') return res.status(400).json({ error: 'Application already reviewed' });

  const tempPassword = crypto.randomBytes(6).toString('base64url');
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const user = await prisma.user.create({
    data: {
      nationalId: application.nationalId || undefined,
      email: application.email,
      name: application.name,
      phone: application.phone,
      passwordHash,
      role: application.appliedRole,
      title: application.specialization,
      titleAr: application.specializationAr || undefined,
      bio: application.bio,
      bioAr: application.bioAr || undefined,
      photoUrl: application.photoUrl || undefined
    }
  });

  await prisma.providerApplication.update({
    where: { id: application.id },
    data: { status: 'approved', reviewedAt: new Date() }
  });

  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
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
