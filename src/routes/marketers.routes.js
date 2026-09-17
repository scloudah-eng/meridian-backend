const express = require('express');
const crypto = require('crypto');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

async function ensureReferralCode(user) {
  if (user.referralCode) return user.referralCode;
  const base = (user.name || 'PARTNER').replace(/[^a-zA-Z\u0600-\u06FF]/g, '').slice(0, 6).toUpperCase() || 'MKT';
  for (let i = 0; i < 5; i++) {
    const candidate = `${base}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    try {
      const updated = await prisma.user.update({ where: { id: user.id }, data: { referralCode: candidate } });
      return updated.referralCode;
    } catch (err) {
      // unique constraint collision — try again
    }
  }
  throw new Error('Could not generate a unique referral code');
}

function summarize(referrals) {
  let totalSales = 0, totalCommission = 0, paidCommission = 0, pendingCommission = 0;
  for (const r of referrals) {
    totalSales += Number(r.saleAmount);
    totalCommission += Number(r.commissionAmount);
    if (r.status === 'paid') paidCommission += Number(r.commissionAmount);
    else pendingCommission += Number(r.commissionAmount);
  }
  return { totalSales, totalCommission, paidCommission, pendingCommission, count: referrals.length };
}

// GET /api/marketers/me   (MARKETER only) — own code, rate, referral history, totals
router.get('/me', authenticate, requireRole('MARKETER'), async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
  const referralCode = await ensureReferralCode(user);

  const referrals = await prisma.referral.findMany({
    where: { marketerId: req.user.sub },
    include: { buyer: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });

  res.json({
    referralCode,
    commissionRate: user.commissionRate,
    referrals,
    totals: summarize(referrals)
  });
});

// GET /api/marketers   (ADMIN only) — every marketer with their totals
router.get('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  const marketers = await prisma.user.findMany({ where: { role: 'MARKETER' }, orderBy: { createdAt: 'desc' } });
  const results = await Promise.all(marketers.map(async m => {
    const referrals = await prisma.referral.findMany({ where: { marketerId: m.id } });
    return {
      id: m.id, name: m.name, nationalId: m.nationalId, phone: m.phone,
      referralCode: m.referralCode, commissionRate: m.commissionRate,
      totals: summarize(referrals)
    };
  }));
  res.json({ marketers: results });
});

const rateSchema = z.object({ commissionRate: z.number().min(0).max(100) });

// PATCH /api/marketers/:id   (ADMIN only)   { commissionRate }
router.patch('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  const parsed = rateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { commissionRate: parsed.data.commissionRate }
  });
  res.json({ marketer: { id: user.id, commissionRate: user.commissionRate } });
});

// GET /api/marketers/:id/referrals   (ADMIN only) — full referral list for one marketer
router.get('/:id/referrals', authenticate, requireRole('ADMIN'), async (req, res) => {
  const referrals = await prisma.referral.findMany({
    where: { marketerId: req.params.id },
    include: { buyer: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ referrals, totals: summarize(referrals) });
});

// PATCH /api/marketers/referrals/:referralId/paid   (ADMIN only) — mark one commission as paid out
router.patch('/referrals/:referralId/paid', authenticate, requireRole('ADMIN'), async (req, res) => {
  const referral = await prisma.referral.update({
    where: { id: req.params.referralId },
    data: { status: 'paid' }
  });
  res.json({ referral });
});

module.exports = router;
