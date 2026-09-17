const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

const PUBLIC_SELECT = {
  id: true, name: true, role: true,
  bio: true, bioAr: true, title: true, titleAr: true,
  photoUrl: true, credentials: true, credentialsAr: true
};

// GET /api/trainers/:id   (public — profile + the courses they teach +
// the consulting services they offer + their portfolio)
router.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: PUBLIC_SELECT });
  if (!user || !['TRAINER', 'CONSULTANT'].includes(user.role)) {
    return res.status(404).json({ error: 'Trainer not found' });
  }
  const [courses, consultingServices, workItems] = await Promise.all([
    prisma.course.findMany({
      where: { instructorId: req.params.id },
      select: { id: true, title: true, titleAr: true, category: true, categoryEn: true, price: true }
    }),
    prisma.consultingService.findMany({
      where: { consultantId: req.params.id },
      select: { id: true, title: true, titleAr: true, category: true, categoryEn: true }
    }),
    prisma.trainerWork.findMany({ where: { trainerId: req.params.id }, orderBy: { order: 'asc' } })
  ]);
  res.json({ trainer: user, courses, consultingServices, workItems });
});

const profileSchema = z.object({
  bio: z.string().optional(),
  bioAr: z.string().optional(),
  title: z.string().optional(),
  titleAr: z.string().optional(),
  credentials: z.string().optional(),
  credentialsAr: z.string().optional()
});

// PATCH /api/trainers/:id   (the trainer themselves, or admin)
router.patch('/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.sub !== req.params.id) {
    return res.status(403).json({ error: 'You can only edit your own profile' });
  }
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: parsed.data,
    select: PUBLIC_SELECT
  });
  res.json({ trainer: user });
});

// ---------------------------------------------------------------------
// Profile photo upload
// ---------------------------------------------------------------------
const photoDir = path.join(__dirname, '..', '..', 'uploads', 'trainer-photos');
fs.mkdirSync(photoDir, { recursive: true });
const photoStorage = multer.diskStorage({
  destination: photoDir,
  filename: (req, file, cb) => cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname) || '.jpg'}`)
});
const photoUpload = multer({
  storage: photoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are accepted'));
    cb(null, true);
  }
});

// POST /api/trainers/:id/photo   (the trainer themselves, or admin)
router.post('/:id/photo', authenticate, photoUpload.single('photo'), async (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.sub !== req.params.id) {
    return res.status(403).json({ error: 'You can only edit your own profile' });
  }
  if (!req.file) return res.status(400).json({ error: 'No image file received (field name must be "photo")' });

  const photoUrl = `/uploads/trainer-photos/${req.file.filename}`;
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { photoUrl }, select: PUBLIC_SELECT });
  res.json({ trainer: user });
});

// ---------------------------------------------------------------------
// Portfolio (work items)
// ---------------------------------------------------------------------
const workSchema = z.object({
  title: z.string().min(2),
  titleAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  linkUrl: z.string().url().optional(),
  order: z.number().int().optional()
});

// POST /api/trainers/:id/work   (the trainer themselves, or admin)
router.post('/:id/work', authenticate, async (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.sub !== req.params.id) {
    return res.status(403).json({ error: 'You can only edit your own portfolio' });
  }
  const parsed = workSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const work = await prisma.trainerWork.create({ data: { ...parsed.data, trainerId: req.params.id } });
  res.status(201).json({ work });
});

// DELETE /api/trainers/:id/work/:workId   (the trainer themselves, or admin)
router.delete('/:id/work/:workId', authenticate, async (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.sub !== req.params.id) {
    return res.status(403).json({ error: 'You can only edit your own portfolio' });
  }
  const work = await prisma.trainerWork.findUnique({ where: { id: req.params.workId } });
  if (!work || work.trainerId !== req.params.id) return res.status(404).json({ error: 'Work item not found' });

  await prisma.trainerWork.delete({ where: { id: req.params.workId } });
  res.json({ success: true });
});

module.exports = router;
