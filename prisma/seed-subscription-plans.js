// Creates four subscription plan tiers (catalog-wide access instead of
// paying per course), matching the Basic/Silver/Gold/Platinum naming
// pattern used by reference platforms in this space.
//
// PRICES AND DURATIONS ARE PLACEHOLDERS — no source document specified
// real subscription pricing for Mada Alhyat, so these are illustrative
// round numbers only. Edit them for real before selling any plan
// (PATCH /api/subscription-plans/:id, admin only).
//
// Run with: npm run seed:plans

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PLANS = [
  {
    tier: 'basic',
    name: 'Basic', nameAr: 'الأساسي',
    description: 'Full course catalog access for one month.',
    descriptionAr: 'وصول كامل لجميع الدورات لمدة شهر واحد.',
    durationDays: 30, price: 99,
    liveSessionsPerMonth: 0, prioritySupport: false
  },
  {
    tier: 'silver',
    name: 'Silver', nameAr: 'الفضي',
    description: 'Full course catalog access for three months, plus 2 live sessions per month.',
    descriptionAr: 'وصول كامل لجميع الدورات لمدة ثلاثة أشهر، مع جلستين مباشرتين شهريًا.',
    durationDays: 90, price: 249,
    liveSessionsPerMonth: 2, prioritySupport: false
  },
  {
    tier: 'gold',
    name: 'Gold', nameAr: 'الذهبي',
    description: 'Full course catalog access for six months, unlimited live sessions, and priority support.',
    descriptionAr: 'وصول كامل لجميع الدورات لمدة ستة أشهر، جلسات مباشرة غير محدودة، ودعم ذو أولوية.',
    durationDays: 180, price: 449,
    liveSessionsPerMonth: null, prioritySupport: true
  },
  {
    tier: 'platinum',
    name: 'Platinum', nameAr: 'البلاتيني',
    description: 'Full course catalog access for a full year, unlimited live sessions, and priority support.',
    descriptionAr: 'وصول كامل لجميع الدورات لمدة سنة كاملة، جلسات مباشرة غير محدودة، ودعم ذو أولوية.',
    durationDays: 365, price: 799,
    liveSessionsPerMonth: null, prioritySupport: true
  }
];

async function main() {
  for (const plan of PLANS) {
    await prisma.subscriptionPlan.upsert({
      where: { tier: plan.tier },
      update: {},
      create: plan
    });
  }
  console.log(`Done. Created/confirmed ${PLANS.length} subscription plans (basic, silver, gold, platinum).`);
  console.log('Prices and durations are placeholders — set real ones via PATCH /api/subscription-plans/:id before selling.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
