const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/payments   { courseId, method } OR { planId, method }
// method is one of: card, mada, applepay, stcpay, paypal, bank
//
// This creates a payment record in 'pending' status and returns its id.
// In production, do NOT call POST /:id/confirm from your own frontend —
// instead:
//   1. Use a Saudi-market payment aggregator (Moyasar, PayTabs or
//      HyperPay all support mada, Apple Pay and STC Pay for merchants
//      in Saudi Arabia) to create a real charge with this payment's id
//      as a reference.
//   2. Configure a webhook endpoint (e.g. POST /api/payments/webhook)
//      that the gateway calls when the charge succeeds or fails, and
//      update the Payment record's status there instead.
//   3. For PayPal, use PayPal's server-side Orders API the same way.
// The /:id/confirm route below is a stand-in for that webhook so the
// full flow is testable without a real gateway account.
router.post('/', authenticate, requireRole('TRAINEE'), async (req, res) => {
  const { courseId, planId, method } = req.body;
  if (!['card', 'mada', 'applepay', 'stcpay', 'paypal', 'bank'].includes(method)) {
    return res.status(400).json({ error: 'Unsupported payment method' });
  }
  if (!courseId && !planId) return res.status(400).json({ error: 'courseId or planId is required' });

  let amount;
  if (courseId) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    amount = course.price;
  } else {
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    amount = plan.price;
  }

  const payment = await prisma.payment.create({
    data: { userId: req.user.sub, courseId: courseId || null, amount, method, status: 'pending' }
  });
  res.status(201).json({ payment });
});

// POST /api/payments/:id/confirm   (demo stand-in for a gateway webhook)
router.post('/:id/confirm', authenticate, async (req, res) => {
  const payment = await prisma.payment.findUnique({ where: { id: req.params.id } });
  if (!payment || payment.userId !== req.user.sub) return res.status(404).json({ error: 'Payment not found' });

  const updated = await prisma.payment.update({ where: { id: payment.id }, data: { status: 'succeeded' } });
  res.json({ payment: updated });
});

module.exports = router;
