const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// ---------------------------------------------------------------------
// File upload — course reference materials and training kits (PDF,
// PPTX, DOCX, ZIP, XLSX). Stored on disk under /uploads/materials, same
// pattern as lesson videos and the platform logo.
// ---------------------------------------------------------------------
const materialsDir = path.join(__dirname, '..', '..', 'uploads', 'materials');
fs.mkdirSync(materialsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: materialsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
    cb(null, `${safeBase}-${Date.now()}${ext}`);
  }
});
const ALLOWED_EXT = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.zip'];
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB — training kits can be large
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) return cb(new Error('File type not allowed. Use PDF, Office documents, or ZIP.'));
    cb(null, true);
  }
});

async function canManageCourse(user, courseId) {
  if (user.role === 'ADMIN') return true;
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { instructorId: true } });
  return !!course && course.instructorId === user.sub;
}

// GET /api/course-materials?courseId=   (public — anyone can see the list;
// actual file download still requires no auth by design, matching how
// preview/lesson content is served, since materials are part of what a
// trainee paid for and there's no separate gate here yet)
router.get('/', async (req, res) => {
  const { courseId } = req.query;
  if (!courseId) return res.status(400).json({ error: 'courseId is required' });
  const materials = await prisma.courseMaterial.findMany({
    where: { courseId },
    orderBy: [{ kind: 'asc' }, { order: 'asc' }]
  });
  res.json({ materials });
});

// POST /api/course-materials/upload   (trainer who owns the course, or admin)
// multipart/form-data: file, courseId, title, titleAr?, kind ("reference"|"kit"), order?
router.post('/upload', authenticate, requireRole('TRAINER', 'ADMIN'), upload.single('file'), async (req, res) => {
  const { courseId, title, titleAr, kind, order } = req.body;
  if (!req.file) return res.status(400).json({ error: 'No file received (field name must be "file")' });
  if (!courseId || !title) return res.status(400).json({ error: 'courseId and title are required' });

  const allowed = await canManageCourse(req.user, courseId);
  if (!allowed) return res.status(403).json({ error: 'You do not own this course' });

  const material = await prisma.courseMaterial.create({
    data: {
      courseId,
      title,
      titleAr: titleAr || undefined,
      kind: kind === 'kit' ? 'kit' : 'reference',
      fileUrl: `/uploads/materials/${req.file.filename}`,
      fileName: req.file.originalname,
      order: order ? Number(order) : 0
    }
  });
  res.status(201).json({ material });
});

// DELETE /api/course-materials/:id   (trainer who owns the course, or admin)
router.delete('/:id', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const material = await prisma.courseMaterial.findUnique({ where: { id: req.params.id } });
  if (!material) return res.status(404).json({ error: 'Material not found' });

  const allowed = await canManageCourse(req.user, material.courseId);
  if (!allowed) return res.status(403).json({ error: 'You do not own this course' });

  await prisma.courseMaterial.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

module.exports = router;
