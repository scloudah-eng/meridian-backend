const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');
const { hasActiveSubscription } = require('./subscriptions.routes');

const router = express.Router();

// POST /api/enrollments   { courseId, paymentId? }
// If the trainee has an active subscription (see subscriptions.routes.js),
// enrollment is free and paymentId can be omitted. Otherwise paymentId
// must belong to this user, this course, and already be marked
// 'succeeded' (see payments.routes.js).
router.post('/', authenticate, requireRole('TRAINEE'), async (req, res) => {
  const { courseId, paymentId } = req.body;
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const subscribed = await hasActiveSubscription(req.user.sub);
  if (!subscribed) {
    if (paymentId) {
      const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
      const valid = payment && payment.status === 'succeeded' && payment.courseId === courseId && payment.userId === req.user.sub;
      if (!valid) return res.status(402).json({ error: 'Payment not confirmed for this course' });
    } else {
      return res.status(402).json({ error: 'Payment or an active subscription is required to enroll' });
    }
  }

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: req.user.sub, courseId } },
    update: {},
    create: { userId: req.user.sub, courseId, paymentId: paymentId || null }
  });
  res.status(201).json({ enrollment });
});

// GET /api/enrollments/mine
router.get('/mine', authenticate, requireRole('TRAINEE'), async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: req.user.sub },
    include: {
      course: { include: { modules: { include: { lessons: true } } } },
      progress: true,
      certificate: true
    },
    orderBy: { enrolledAt: 'desc' }
  });
  res.json({ enrollments: enrollments.map(withProgressSummary) });
});

const progressSchema = z.object({
  lessonId: z.string(),
  watchedSeconds: z.number().int().min(0)
});

// POST /api/enrollments/:id/progress   { lessonId, watchedSeconds }
// A lesson is marked completed once 80% of its duration has been
// watched — this is the "minimum training hours" gate: the certificate
// endpoint (certificates.routes.js) refuses to issue until every lesson
// in the course is completed this way.
router.post('/:id/progress', authenticate, requireRole('TRAINEE'), async (req, res) => {
  const parsed = progressSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const enrollment = await prisma.enrollment.findUnique({ where: { id: req.params.id } });
  if (!enrollment || enrollment.userId !== req.user.sub) return res.status(404).json({ error: 'Enrollment not found' });

  const lesson = await prisma.lesson.findUnique({ where: { id: parsed.data.lessonId } });
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const clamped = Math.min(parsed.data.watchedSeconds, lesson.durationSeconds);
  const completed = lesson.durationSeconds > 0 && clamped / lesson.durationSeconds >= 0.8;

  const progress = await prisma.lessonProgress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId: lesson.id } },
    update: { watchedSeconds: clamped, completed },
    create: { enrollmentId: enrollment.id, lessonId: lesson.id, watchedSeconds: clamped, completed }
  });
  res.json({ progress });
});

function withProgressSummary(enrollment) {
  const totalLessons = enrollment.course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const completedLessons = enrollment.progress.filter((p) => p.completed).length;
  return {
    ...enrollment,
    totalLessons,
    completedLessons,
    allLessonsComplete: totalLessons > 0 && completedLessons === totalLessons
  };
}

module.exports = router;
