const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'videos');
fs.mkdirSync(uploadDir, { recursive: true });

// NOTE ON VIDEO STORAGE: this saves uploaded video files to the server's
// local disk — enough to test the full "add a lesson, upload its video"
// flow end to end, but not production-ready. Raw files served this way
// have no adaptive-bitrate streaming, no CDN, and will fill up disk and
// bandwidth fast at real scale. For production, swap the storage engine
// below for a proper video host — Mux, Cloudflare Stream, or Bunny
// Stream are common choices for e-learning platforms and handle
// transcoding and streaming for you — and save the URL/playback ID
// they return into Lesson.videoUrl instead of a local path.
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    cb(null, `${req.params.id}-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB ceiling, tune as needed
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) return cb(new Error('Only video files are accepted'));
    cb(null, true);
  }
});

async function assertLessonOwnership(req, res, lessonId) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } } }
  });
  if (!lesson) { res.status(404).json({ error: 'Lesson not found' }); return null; }
  if (req.user.role !== 'ADMIN' && lesson.module.course.instructorId !== req.user.sub) {
    res.status(403).json({ error: 'You can only edit lessons on your own courses' });
    return null;
  }
  return lesson;
}

const lessonSchema = z.object({
  title: z.string().min(2),
  titleAr: z.string().optional(),
  order: z.number().int().min(1),
  durationSeconds: z.number().int().min(1)
});

// POST /api/modules/:moduleId/lessons   (add a lesson to a module)
router.post('/modules/:moduleId/lessons', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const mod = await prisma.module.findUnique({ where: { id: req.params.moduleId }, include: { course: true } });
  if (!mod) return res.status(404).json({ error: 'Module not found' });
  if (req.user.role !== 'ADMIN' && mod.course.instructorId !== req.user.sub) {
    return res.status(403).json({ error: 'You can only edit your own courses' });
  }
  const parsed = lessonSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const lesson = await prisma.lesson.create({ data: { ...parsed.data, moduleId: mod.id } });
  res.status(201).json({ lesson });
});

// PATCH /api/lessons/:id
router.patch('/lessons/:id', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const lesson = await assertLessonOwnership(req, res, req.params.id);
  if (!lesson) return;
  const parsed = lessonSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const updated = await prisma.lesson.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ lesson: updated });
});

// DELETE /api/lessons/:id
router.delete('/lessons/:id', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const lesson = await assertLessonOwnership(req, res, req.params.id);
  if (!lesson) return;
  await prisma.lesson.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// POST /api/lessons/:id/video   (multipart/form-data, field name "video")
// Uploads a pre-recorded video file for this lesson. This is file upload,
// not in-browser recording — capturing webcam/screen video directly in
// the browser (e.g. to record a lecture) is a separate frontend feature
// (the MediaRecorder API) that would still end by uploading the result
// to this same endpoint.
router.post('/lessons/:id/video', authenticate, requireRole('TRAINER', 'ADMIN'), upload.single('video'), async (req, res) => {
  const lesson = await assertLessonOwnership(req, res, req.params.id);
  if (!lesson) return;
  if (!req.file) return res.status(400).json({ error: 'No video file received (field name must be "video")' });

  const videoUrl = `/uploads/videos/${req.file.filename}`;
  const updated = await prisma.lesson.update({ where: { id: req.params.id }, data: { videoUrl } });
  res.json({ lesson: updated });
});

module.exports = router;
