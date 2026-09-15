// Adds a new, distinct consulting category: helping companies prepare
// for listing on the Saudi capital market (Nomu parallel market or the
// main Tadawul market) — governance, policies, business continuity, and
// standards/regulatory alignment for listing requirements. This is a
// real service line the client described directly, not from the PDF
// axes, so it's added as its own category rather than folded into one
// of the original 10.
//
// Run with: npm run seed:listing

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORY_AR = 'الإدراج والجاهزية للسوق المالي (نمو / تاسي)';
const CATEGORY_EN = 'Capital Market Listing Readiness (Nomu / Tadawul)';

const SERVICES = [
  {
    ar: 'تقييم الجاهزية للإدراج (نمو / تاسي)',
    en: 'IPO & Listing Readiness Assessment (Nomu / Tadawul)',
    descAr: 'تقييم شامل لمدى جاهزية المنشأة للإدراج في السوق الموازية (نمو) أو السوق الرئيسية (تاسي)، يحدد الفجوات في الحوكمة والسياسات والإفصاح المالي قبل بدء رحلة الإدراج الفعلية.',
    descEn: 'A comprehensive assessment of how ready a company is for listing on the parallel market (Nomu) or the main market (Tadawul), identifying governance, policy, and financial disclosure gaps before the formal listing process begins.'
  },
  {
    ar: 'تصميم سياسات وأطر الحوكمة المؤسسية لمتطلبات الإدراج',
    en: 'Corporate Governance Policy & Framework Design for Listing Requirements',
    descAr: 'بناء سياسات وهياكل حوكمة (مجلس الإدارة، اللجان، تفويض الصلاحيات) متوافقة مع لوائح هيئة السوق المالية ومتطلبات الإدراج في نمو وتاسي.',
    descEn: 'Building governance policies and structures (board composition, committees, delegation of authority) aligned with Capital Market Authority regulations and Nomu/Tadawul listing requirements.'
  },
  {
    ar: 'استمرارية الأعمال ومتطلبات الإدراج',
    en: 'Business Continuity for Listing Compliance',
    descAr: 'تصميم وتوثيق خطط استمرارية الأعمال وإدارة المخاطر التشغيلية بما يلبي متطلبات الإفصاح والجاهزية المؤسسية التي تشترطها جهات الإدراج.',
    descEn: 'Designing and documenting business continuity plans and operational risk management to meet the disclosure and institutional readiness requirements expected by listing authorities.'
  },
  {
    ar: 'مواءمة المعايير والامتثال التنظيمي للإدراج',
    en: 'Regulatory Standards Alignment for Listing',
    descAr: 'مراجعة ومواءمة الإجراءات الداخلية والسياسات المالية والتشغيلية مع معايير هيئة السوق المالية ومتطلبات الإفصاح المستمر بعد الإدراج.',
    descEn: 'Reviewing and aligning internal procedures and financial/operational policies with Capital Market Authority standards and ongoing post-listing disclosure requirements.'
  }
];

async function main() {
  const consultant = await prisma.user.findUnique({ where: { nationalId: '1000000098' } });
  if (!consultant) {
    console.error('Consultant account (nationalId 1000000098) not found — run `npm run seed:consulting` first.');
    process.exit(1);
  }

  let created = 0, skipped = 0;
  for (const service of SERVICES) {
    const existing = await prisma.consultingService.findFirst({ where: { title: service.en } });
    if (existing) { skipped++; continue; }

    await prisma.consultingService.create({
      data: {
        title: service.en,
        titleAr: service.ar,
        category: CATEGORY_AR,
        categoryEn: CATEGORY_EN,
        description: service.descEn,
        descriptionAr: service.descAr,
        consultantId: consultant.id
      }
    });
    created++;
  }

  console.log(`Done. Created ${created} listing-readiness consulting services (${skipped} already existed and were skipped).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
