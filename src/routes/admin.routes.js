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

// GET /api/admin/payments   — every payment ever created, newest first, for
// bookkeeping/reconciliation. Shows what it was for (a course, or a
// subscription plan via its linked Subscription) since Payment itself
// only has a direct relation to Course.
router.get('/payments', authenticate, requireRole('ADMIN'), async (req, res) => {
  const payments = await prisma.payment.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, titleAr: true } },
      subscription: { include: { plan: { select: { name: true, nameAr: true } } } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json({
    payments: payments.map(p => ({
      id: p.id,
      buyer: p.user,
      amount: p.amount,
      method: p.method,
      status: p.status,
      createdAt: p.createdAt,
      for: p.course
        ? { type: 'course', title: p.course.title, titleAr: p.course.titleAr }
        : p.subscription
          ? { type: 'subscription', title: p.subscription.plan.name, titleAr: p.subscription.plan.nameAr }
          : { type: 'unknown' }
    }))
  });
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
