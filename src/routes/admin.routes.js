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

// GET /api/admin/messages   — every inquiry/message from all six sources,
// normalized into one shape and sorted newest-first, so nothing gets
// missed by having to check six separate places (and so nothing is lost
// if email notifications fail — everything here is also in the DB).
router.get('/messages', authenticate, requireRole('ADMIN'), async (req, res) => {
  const [courseReqs, consultingReqs, corporateReqs, solutionReqs, contactMsgs, combinedReqs] = await Promise.all([
    prisma.courseRequest.findMany({ include: { course: { select: { title: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.consultingRequest.findMany({ include: { service: { select: { title: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.corporatePackageInquiry.findMany({ include: { package: { select: { name: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.businessSolutionRequest.findMany({ include: { solution: { select: { title: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.combinedInquiry.findMany({ orderBy: { createdAt: 'desc' } })
  ]);

  const messages = [
    ...courseReqs.map(r => ({ id: r.id, type: 'course_request', source: `Course catalog: ${r.course.title}`, name: r.name, email: r.email, phone: r.phone, message: r.message, status: null, createdAt: r.createdAt })),
    ...consultingReqs.map(r => ({ id: r.id, type: 'consulting', source: `Consulting: ${r.service.title}`, name: r.name, email: r.email, phone: r.phone, message: r.message, status: r.status, createdAt: r.createdAt })),
    ...corporateReqs.map(r => ({ id: r.id, type: 'corporate', source: `Corporate: ${r.package.name}`, name: r.contactName, email: r.email, phone: r.phone, message: `${r.companyName}${r.seats ? ` — ${r.seats} seats` : ''}\n${r.message}`, status: r.status, createdAt: r.createdAt })),
    ...solutionReqs.map(r => ({ id: r.id, type: 'solution', source: `Business solution: ${r.solution.title}`, name: r.name, email: r.email, phone: r.phone, message: r.message, status: r.status, createdAt: r.createdAt })),
    ...contactMsgs.map(r => ({ id: r.id, type: 'contact', source: `Contact form${r.subject ? `: ${r.subject}` : ''}`, name: r.name, email: r.email, phone: r.phone, message: r.message, status: r.status, createdAt: r.createdAt })),
    ...combinedReqs.map(r => ({ id: r.id, type: 'combined', source: `Consulting + Training${r.company ? ` (${r.company})` : ''}`, name: r.name, email: r.email, phone: r.phone, message: r.message, status: r.status, createdAt: r.createdAt }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ messages });
});

// PATCH /api/admin/messages/:type/:id   { status }   — updates the status
// on whichever underlying table the message came from. course_request has
// no status field (nothing to update; it's a simple request record).
router.patch('/messages/:type/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { status } = req.body;
  if (!['new', 'contacted', 'closed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const { type, id } = req.params;
  const table = {
    consulting: 'consultingRequest',
    corporate: 'corporatePackageInquiry',
    solution: 'businessSolutionRequest',
    contact: 'contactMessage',
    combined: 'combinedInquiry'
  }[type];
  if (!table) return res.status(400).json({ error: 'This message type has no status to update' });
  const updated = await prisma[table].update({ where: { id }, data: { status } });
  res.json({ item: updated });
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
