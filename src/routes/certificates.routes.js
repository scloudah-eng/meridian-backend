const express = require('express');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/certificates/:enrollmentId/issue
// Refuses unless every lesson in the course has been completed
// (see the 80%-watched gate in enrollments.routes.js).
router.post('/:enrollmentId/issue', authenticate, requireRole('TRAINEE'), async (req, res) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: req.params.enrollmentId },
    include: {
      course: { include: { modules: { include: { lessons: true } } } },
      progress: true,
      certificate: true
    }
  });
  if (!enrollment || enrollment.userId !== req.user.sub) return res.status(404).json({ error: 'Enrollment not found' });
  if (enrollment.certificate) return res.json({ certificate: enrollment.certificate });

  const totalLessons = enrollment.course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const completedLessons = enrollment.progress.filter((p) => p.completed).length;
  if (totalLessons === 0 || completedLessons < totalLessons) {
    return res.status(400).json({ error: 'All lessons must be completed before a certificate can be issued' });
  }

  const refCode = `MAH-${enrollment.courseId.slice(0, 6).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const certificate = await prisma.certificate.create({
    data: { enrollmentId: enrollment.id, userId: req.user.sub, refCode }
  });
  res.status(201).json({ certificate });
});

// GET /api/certificates/verify/:refCode
// Public, unauthenticated — this is what the QR code on a printed
// certificate should point to, so anyone can confirm it's genuine.
router.get('/verify/:refCode', async (req, res) => {
  const certificate = await prisma.certificate.findUnique({
    where: { refCode: req.params.refCode },
    include: {
      user: { select: { name: true } },
      enrollment: { include: { course: { select: { title: true, titleAr: true } } } }
    }
  });
  if (!certificate) return res.status(404).json({ valid: false });

  res.json({
    valid: true,
    name: certificate.user.name,
    course: certificate.enrollment.course.title,
    courseAr: certificate.enrollment.course.titleAr,
    issuedAt: certificate.issuedAt,
    refCode: certificate.refCode
  });
});

module.exports = router;
