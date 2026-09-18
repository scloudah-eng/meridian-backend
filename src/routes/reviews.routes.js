const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/courses/:courseId/reviews   (public)
// Returns the reviews plus a simple average/count summary.
router.get('/:courseId/reviews', async (req, res) => {
  const reviews = await prisma.courseReview.findMany({
    where: { courseId: req.params.courseId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  const count = reviews.length;
  const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  res.json({
    reviews: reviews.map(r => ({ id: r.id, rating: r.rating, comment: r.comment, createdAt: r.createdAt, name: r.user.name })),
    average: Math.round(average * 10) / 10,
    count
  });
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional()
});

// POST /api/courses/:courseId/reviews   (TRAINEE only, must be enrolled)
// Upserts — resubmitting replaces the trainee's existing review for this course.
router.post('/:courseId/reviews', authenticate, requireRole('TRAINEE'), async (req, res) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: req.user.sub, courseId: req.params.courseId } }
  });
  if (!enrollment) return res.status(403).json({ error: 'You must be enrolled in this course to review it' });

  const review = await prisma.courseReview.upsert({
    where: { courseId_userId: { courseId: req.params.courseId, userId: req.user.sub } },
    update: { rating: parsed.data.rating, comment: parsed.data.comment },
    create: { courseId: req.params.courseId, userId: req.user.sub, rating: parsed.data.rating, comment: parsed.data.comment }
  });
  res.status(201).json({ review });
});

module.exports = router;
