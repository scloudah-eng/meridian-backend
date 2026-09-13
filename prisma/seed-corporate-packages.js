// Creates four corporate/B2B package tiers — bulk training deals sold by
// inquiry (a company submits an inquiry, gets a quote) rather than
// instant checkout, matching how B2B training packages are actually
// sold.
//
// These are ORIGINAL package names and tiers for Mada Alhyat — not
// copied from any other platform's naming or structure. Seat counts and
// starting prices are placeholders; edit them via
// PATCH /api/corporate-packages/:id (admin only) before quoting anyone.
//
// Run with: npm run seed:corporate

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PACKAGES = [
  {
    tier: 'corporate-starter',
    name: 'Corporate Starter', nameAr: 'الأساسية للمؤسسات',
    description: 'A entry-level package for small teams getting started with structured training across the catalog.',
    descriptionAr: 'باقة مبدئية للفرق الصغيرة لبدء التدريب المنظم عبر الكتالوج.',
    seatsIncluded: 10, priceFrom: 2500
  },
  {
    tier: 'growth-professional',
    name: 'Growth Professional', nameAr: 'احترافية النمو',
    description: 'For growing teams — broader seat count, course + consulting access, and quarterly progress reporting.',
    descriptionAr: 'للفرق النامية — عدد مقاعد أوسع، وصول للدورات والاستشارات، وتقارير تقدّم ربع سنوية.',
    seatsIncluded: 30, priceFrom: 6500
  },
  {
    tier: 'institutional-leadership',
    name: 'Institutional Leadership', nameAr: 'القيادة المؤسسية',
    description: 'For departments and divisions — custom cohort scheduling, live sessions, and a dedicated account contact.',
    descriptionAr: 'للإدارات والقطاعات — جدولة مجموعات مخصصة، جلسات مباشرة، ومسؤول حساب مخصص.',
    seatsIncluded: 75, priceFrom: 15000
  },
  {
    tier: 'strategic-partnership',
    name: 'Strategic Partnership', nameAr: 'الشراكة الاستراتيجية',
    description: 'For organization-wide rollouts — negotiated scope, custom curricula, and executive reporting. Contact us for a tailored quote.',
    descriptionAr: 'لتطبيق على مستوى المؤسسة بالكامل — نطاق قابل للتفاوض، مناهج مخصصة، وتقارير تنفيذية. تواصلوا معنا للحصول على عرض مخصص.',
    seatsIncluded: null, priceFrom: null
  }
];

async function main() {
  for (const pkg of PACKAGES) {
    await prisma.corporatePackage.upsert({
      where: { tier: pkg.tier },
      update: {},
      create: pkg
    });
  }
  console.log(`Done. Created/confirmed ${PACKAGES.length} corporate packages.`);
  console.log('Seat counts and prices are placeholders — set real ones via PATCH /api/corporate-packages/:id before quoting.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
