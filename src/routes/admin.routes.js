const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', authenticate, requireRole('ADMIN'), async (req, res) => {
  const [courseCount, traineeCount, trainerCount, payments] = await Promise.all([
    prisma.course.count(),
    prisma.user.count({ where: { role: 'TRAINEE' } }),
    prisma.user.count({ where: { role: 'TRAINER' } }),
    prisma.payment.findMany({ where: { status: 'succeeded' } })
  ]);
  const revenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  res.json({ courseCount, traineeCount, trainerCount, revenue });
});

// GET /api/admin/courses   (full catalog with instructor + enrollment counts)
router.get('/courses', authenticate, requireRole('ADMIN'), async (req, res) => {
  const courses = await prisma.course.findMany({
    include: {
      instructor: { select: { name: true } },
      _count: { select: { enrollments: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ courses });
});

module.exports = router;
