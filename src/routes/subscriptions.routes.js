const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');
const { recordReferral } = require('../lib/referrals');

const router = express.Router();

// GET /api/subscription-plans   (public)
router.get('/subscription-plans', async (req, res) => {
  const plans = await prisma.subscriptionPlan.findMany({ where: { active: true }, orderBy: { price: 'asc' } });
  res.json({ plans });
});

const planSchema = z.object({
  tier: z.string().min(2),
  name: z.string().min(2),
  nameAr: z.string().optional(),
  description: z.string().min(5),
  descriptionAr: z.string().optional(),
  durationDays: z.number().int().positive(),
  price: z.number().positive(),
  liveSessionsPerMonth: z.number().int().nullable().optional(),
  prioritySupport: z.boolean().optional()
});

// POST /api/subscription-plans   (admin only)
router.post('/subscription-plans', authenticate, requireRole('ADMIN'), async (req, res) => {
  const parsed = planSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const plan = await prisma.subscriptionPlan.create({ data: parsed.data });
  res.status(201).json({ plan });
});

// PATCH /api/subscription-plans/:id   (admin only)
router.patch('/subscription-plans/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  const parsed = planSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const plan = await prisma.subscriptionPlan.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ plan });
});

// POST /api/subscriptions   { planId, paymentId }
// Same pattern as course enrollment: paymentId must already be a
// 'succeeded' payment (see payments.routes.js) before the subscription
// is activated. Activating sets startDate=now and endDate=now+durationDays.
router.post('/subscriptions', authenticate, requireRole('TRAINEE'), async (req, res) => {
  const { planId, paymentId, refCode } = req.body;
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  let status = 'pending';
  let startDate = null, endDate = null;
  let confirmedPayment = null;
  if (paymentId) {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    // Subscription payments reuse the Payment table with courseId left
    // pointing at nothing meaningful — in production, give Payment a
    // nullable courseId and a polymorphic reference instead.
    const valid = payment && payment.status === 'succeeded' && payment.userId === req.user.sub;
    if (!valid) return res.status(402).json({ error: 'Payment not confirmed for this subscription' });
    confirmedPayment = payment;
    status = 'active';
    startDate = new Date();
    endDate = new Date(startDate.getTime() + plan.durationDays * 86400000);
  }

  const subscription = await prisma.subscription.create({
    data: { userId: req.user.sub, planId, paymentId: paymentId || null, status, startDate, endDate }
  });

  if (confirmedPayment) {
    recordReferral({ refCode, buyerId: req.user.sub, saleType: 'subscription', saleAmount: confirmedPayment.amount, paymentId: confirmedPayment.id });
  }

  res.status(201).json({ subscription });
});

// GET /api/subscriptions/mine
router.get('/subscriptions/mine', authenticate, requireRole('TRAINEE'), async (req, res) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: req.user.sub },
    include: { plan: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ subscriptions });
});

// Helper used by enrollments.routes.js: does this user currently have an
// active, unexpired subscription? If so, course enrollment can skip the
// per-course payment step.
async function hasActiveSubscription(userId) {
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: 'active', endDate: { gt: new Date() } }
  });
  return !!sub;
}

module.exports = router;
module.exports.hasActiveSubscription = hasActiveSubscription;
