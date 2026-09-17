// Records a commission-earning sale for a marketer's referral code.
// Called after a paid enrollment or subscription purchase completes
// successfully. Never throws — a referral-tracking failure should never
// block the actual purchase it's attached to.

const prisma = require('./prisma');

/**
 * @param {object} params
 * @param {string} params.refCode     the ?ref= code the buyer arrived with (may be empty/undefined)
 * @param {string} params.buyerId     the purchasing user's id
 * @param {string} params.saleType    "enrollment" | "subscription"
 * @param {number|string} params.saleAmount  the amount actually paid
 * @param {string} [params.paymentId] the Payment row this sale is tied to, if any (kept unique so a sale is never double-counted)
 */
async function recordReferral({ refCode, buyerId, saleType, saleAmount, paymentId }) {
  if (!refCode) return null;
  const amount = Number(saleAmount);
  if (!amount || amount <= 0) return null;

  try {
    const marketer = await prisma.user.findFirst({ where: { referralCode: refCode, role: 'MARKETER' } });
    if (!marketer || marketer.id === buyerId) return null; // unknown code, or self-referral

    const rate = marketer.commissionRate != null ? marketer.commissionRate : 10;
    const commissionAmount = amount * (rate / 100);

    return await prisma.referral.create({
      data: {
        marketerId: marketer.id,
        buyerId,
        saleType,
        saleAmount: amount,
        commissionRate: rate,
        commissionAmount,
        paymentId: paymentId || undefined
      }
    });
  } catch (err) {
    // Most likely a duplicate paymentId (this sale was already recorded)
    // — safe to swallow, since the referral only needs to exist once.
    console.error('[referrals] Failed to record referral:', err.message);
    return null;
  }
}

module.exports = { recordReferral };
