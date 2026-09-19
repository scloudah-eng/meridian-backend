const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');
const mailer = require('../lib/mailer');

const router = express.Router();

// GET /api/courses?category=Business&q=excel   (public catalog, no auth needed)
router.get('/', async (req, res) => {
  const { category, q, status } = req.query;
  const courses = await prisma.course.findMany({
    where: {
      ...(category && category !== 'All' ? { category: String(category) } : {}),
      ...(q ? { title: { contains: String(q), mode: 'insensitive' } } : {}),
      ...(status ? { status: String(status) } : {})
    },
    include: {
      instructor: { select: { id: true, name: true } },
      modules: { include: { lessons: true }, orderBy: { order: 'asc' } },
      _count: { select: { enrollments: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ courses });
});

// GET /api/courses/my/students   (TRAINER only) — every trainee enrolled across
// this trainer's own courses, with per-trainee progress, so a trainer can see
// who is taking their courses and how far along they are (mirrors the
// institution roster at /api/institution/roster).
router.get('/my/students', authenticate, requireRole('TRAINER'), async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { course: { instructorId: req.user.sub } },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      course: { select: { id: true, title: true, titleAr: true } },
      progress: true
    },
    orderBy: { enrolledAt: 'desc' }
  });

  const roster = enrollments.map(e => {
    const total = e.progress.length;
    const completed = e.progress.filter(p => p.completed).length;
    return {
      enrollmentId: e.id,
      trainee: e.user,
      course: e.course,
      enrolledAt: e.enrolledAt,
      lessonsCompleted: completed,
      lessonsStarted: total
    };
  });
  res.json({ roster });
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.id },
    include: {
      instructor: { select: { id: true, name: true } },
      modules: { include: { lessons: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } },
      _count: { select: { enrollments: true } }
    }
  });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json({ course });
});

const courseSchema = z.object({
  title: z.string().min(2),
  titleAr: z.string().optional(),
  category: z.string().min(2),
  categoryEn: z.string().optional(),
  description: z.string().min(10),
  descriptionAr: z.string().optional(),
  status: z.enum(['ACTIVE', 'CATALOG']).default('ACTIVE'),
  deliveryType: z.enum(['RECORDED', 'LIVE', 'IN_PERSON']).default('RECORDED'),
  maxSeats: z.number().int().positive().optional(),
  locationName: z.string().optional(),
  locationNameAr: z.string().optional(),
  locationAddress: z.string().optional(),
  price: z.number().positive()
});

// POST /api/courses   (trainer or admin — trainer becomes the instructor)
router.post('/', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const course = await prisma.course.create({
    data: { ...parsed.data, instructorId: req.user.sub }
  });
  res.status(201).json({ course });
});

// PATCH /api/courses/:id   (the owning trainer, or any admin)
const courseRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional()
});

// POST /api/courses/:id/request   (public — no account required)
// A visitor expressing interest in a CATALOG (not-yet-active) course.
// Also works for an ACTIVE course (harmless — just recorded as a signal).
router.post('/:id/request', async (req, res) => {
  const course = await prisma.course.findUnique({ where: { id: req.params.id } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const parsed = courseRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const request = await prisma.courseRequest.create({
    data: { courseId: course.id, ...parsed.data }
  });
  mailer.notify(
    `Course interest: ${course.title}`,
    `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nPhone: ${parsed.data.phone || '-'}\nCourse: ${course.title}\n\nMessage:\n${parsed.data.message || '-'}`
  );
  res.status(201).json({ request });
});

// GET /api/courses/:id/requests   (the owning trainer, or any admin)
router.get('/:id/requests', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const course = await prisma.course.findUnique({ where: { id: req.params.id } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (req.user.role !== 'ADMIN' && course.instructorId !== req.user.sub) {
    return res.status(403).json({ error: 'You can only view requests for your own courses' });
  }
  const requests = await prisma.courseRequest.findMany({ where: { courseId: course.id }, orderBy: { createdAt: 'desc' } });
  res.json({ requests });
});

router.patch('/:id', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const course = await prisma.course.findUnique({ where: { id: req.params.id } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (req.user.role !== 'ADMIN' && course.instructorId !== req.user.sub) {
    return res.status(403).json({ error: 'You can only edit your own courses' });
  }

  const parsed = courseSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const updated = await prisma.course.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ course: updated });
});

// DELETE /api/courses/:id   (the owning trainer, or any admin)
router.delete('/:id', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const course = await prisma.course.findUnique({ where: { id: req.params.id } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (req.user.role !== 'ADMIN' && course.instructorId !== req.user.sub) {
    return res.status(403).json({ error: 'You can only delete your own courses' });
  }
  await prisma.course.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// ---------------------------------------------------------------------
// Free preview video (marketing video). Unlike lesson videos, this is
// returned by the public GET routes above and playable by anyone —
// no enrollment or payment required — since its purpose is to help a
// visitor decide whether to enroll.
// ---------------------------------------------------------------------
const previewUploadDir = path.join(__dirname, '..', '..', 'uploads', 'previews');
fs.mkdirSync(previewUploadDir, { recursive: true });

const previewStorage = multer.diskStorage({
  destination: previewUploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    cb(null, `${req.params.id}-preview-${Date.now()}${ext}`);
  }
});
const previewUpload = multer({
  storage: previewStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB — preview clips should be short
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) return cb(new Error('Only video files are accepted'));
    cb(null, true);
  }
});

// POST /api/courses/:id/preview-video   (multipart/form-data, field "video")
router.post('/:id/preview-video', authenticate, requireRole('TRAINER', 'ADMIN'), previewUpload.single('video'), async (req, res) => {
  const course = await prisma.course.findUnique({ where: { id: req.params.id } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (req.user.role !== 'ADMIN' && course.instructorId !== req.user.sub) {
    return res.status(403).json({ error: 'You can only edit your own courses' });
  }
  if (!req.file) return res.status(400).json({ error: 'No video file received (field name must be "video")' });

  const previewVideoUrl = `/uploads/previews/${req.file.filename}`;
  const updated = await prisma.course.update({ where: { id: req.params.id }, data: { previewVideoUrl } });
  res.json({ course: updated });
});

// DELETE /api/courses/:id/preview-video   (remove the preview video without deleting the course)
router.delete('/:id/preview-video', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const course = await prisma.course.findUnique({ where: { id: req.params.id } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (req.user.role !== 'ADMIN' && course.instructorId !== req.user.sub) {
    return res.status(403).json({ error: 'You can only edit your own courses' });
  }
  const updated = await prisma.course.update({ where: { id: req.params.id }, data: { previewVideoUrl: null } });
  res.json({ course: updated });
});

module.exports = router;
