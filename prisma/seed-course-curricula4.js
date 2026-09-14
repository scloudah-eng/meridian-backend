// Fourth batch — same rich 3-module pattern as batch 3.
// Run with: npm run seed:curricula4

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LESSON_DURATION = 600;

const CURRICULA = [
  {
    courseTitle: 'Investigations for Non-Auditors',
    modules: [
      { title: 'Foundations of Investigations', titleAr: 'أساسيات التحقيقات', lessons: [
        { en: 'Definition of a Workplace Investigation', ar: 'تعريف التحقيق في بيئة العمل' },
        { en: 'Importance of Investigation Skills for Non-Auditors', ar: 'أهمية مهارات التحقيق لغير المراجعين' },
        { en: 'Core Elements of an Investigation Plan', ar: 'العناصر الأساسية لخطة التحقيق' },
        { en: 'Types of Evidence & Documentation', ar: 'أنواع الأدلة والتوثيق' }
      ]},
      { title: 'Conducting the Investigation', titleAr: 'إجراء التحقيق', lessons: [
        { en: 'Factors Affecting Investigation Credibility', ar: 'العوامل المؤثرة في مصداقية التحقيق' },
        { en: 'Interviewing Techniques for Non-Specialists', ar: 'تقنيات المقابلة لغير المتخصصين' }
      ]},
      { title: 'Concluding & Reporting', titleAr: 'الخلوص وإعداد التقرير', lessons: [
        { en: 'Measuring Investigation Outcomes', ar: 'قياس نتائج التحقيق' },
        { en: 'Improving Investigation Report Writing', ar: 'تحسين كتابة تقارير التحقيق' }
      ]}
    ]
  },
  {
    courseTitle: 'Certified Risk Analyst (CRA)',
    modules: [
      { title: 'Foundations of Risk Analysis', titleAr: 'أساسيات تحليل المخاطر', lessons: [
        { en: 'Definition of Risk Analysis', ar: 'تعريف تحليل المخاطر' },
        { en: 'Importance of the CRA Credential', ar: 'أهمية شهادة CRA' },
        { en: 'Core Elements of a Risk Analysis Process', ar: 'العناصر الأساسية لعملية تحليل المخاطر' },
        { en: 'Qualitative vs Quantitative Analysis', ar: 'التحليل الكمي مقابل النوعي' }
      ]},
      { title: 'Applying Risk Analysis Tools', titleAr: 'تطبيق أدوات تحليل المخاطر', lessons: [
        { en: 'Factors Affecting Analysis Accuracy', ar: 'العوامل المؤثرة في دقة التحليل' },
        { en: 'Common Risk Analysis Techniques', ar: 'تقنيات تحليل المخاطر الشائعة' }
      ]},
      { title: 'Professional Application', titleAr: 'التطبيق المهني', lessons: [
        { en: 'Measuring Risk Analyst Effectiveness', ar: 'قياس فعالية محلل المخاطر' },
        { en: 'Improving Risk Reporting to Leadership', ar: 'تحسين رفع تقارير المخاطر للإدارة' }
      ]}
    ]
  },
  {
    courseTitle: 'Certified Anti-Corruption Officer (GAFM® – CACO)',
    modules: [
      { title: 'Foundations of Anti-Corruption', titleAr: 'أساسيات مكافحة الفساد', lessons: [
        { en: 'Definition of Corruption & Its Forms', ar: 'تعريف الفساد وأشكاله' },
        { en: 'Importance of a Dedicated Anti-Corruption Role', ar: 'أهمية وجود دور مخصص لمكافحة الفساد' },
        { en: 'Core Elements of an Anti-Corruption Program', ar: 'العناصر الأساسية لبرنامج مكافحة الفساد' },
        { en: 'Overview of Key Anti-Corruption Laws', ar: 'نظرة عامة على قوانين مكافحة الفساد الرئيسية' }
      ]},
      { title: 'Managing Anti-Corruption Risk', titleAr: 'إدارة مخاطر الفساد', lessons: [
        { en: 'Factors Affecting Corruption Risk Exposure', ar: 'العوامل المؤثرة في التعرض لمخاطر الفساد' },
        { en: 'Due Diligence & Red-Flag Screening Techniques', ar: 'تقنيات العناية الواجبة وفحص الإشارات التحذيرية' }
      ]},
      { title: 'Sustaining the Program', titleAr: 'استدامة البرنامج', lessons: [
        { en: 'Measuring Anti-Corruption Program Maturity', ar: 'قياس نضج برنامج مكافحة الفساد' },
        { en: 'Improving Investigation & Remediation Processes', ar: 'تحسين عمليات التحقيق والمعالجة' }
      ]}
    ]
  },
  {
    courseTitle: 'Certified Anti-Money Laundering Officer (GAFM – CAMO)',
    modules: [
      { title: 'Foundations of the AML Officer Role', titleAr: 'أساسيات دور مسؤول مكافحة غسل الأموال', lessons: [
        { en: 'Definition of the MLRO/AML Officer Role', ar: 'تعريف دور مسؤول الإبلاغ عن غسل الأموال' },
        { en: 'Importance of a Dedicated AML Officer', ar: 'أهمية وجود مسؤول مكافحة غسل أموال مخصص' },
        { en: 'Core Elements of AML Governance', ar: 'العناصر الأساسية لحوكمة مكافحة غسل الأموال' },
        { en: 'Regulatory Reporting Obligations', ar: 'التزامات الإبلاغ التنظيمي' }
      ]},
      { title: 'Managing the AML Program', titleAr: 'إدارة برنامج مكافحة غسل الأموال', lessons: [
        { en: 'Factors Affecting AML Program Effectiveness', ar: 'العوامل المؤثرة في فعالية البرنامج' },
        { en: 'Risk-Based Approach Techniques', ar: 'تقنيات النهج القائم على المخاطر' }
      ]},
      { title: 'Professional Accountability', titleAr: 'المساءلة المهنية', lessons: [
        { en: 'Measuring Officer & Program Performance', ar: 'قياس أداء المسؤول والبرنامج' },
        { en: 'Improving Regulatory Relationship Management', ar: 'تحسين إدارة العلاقة مع الجهات التنظيمية' }
      ]}
    ]
  },
  {
    courseTitle: 'Project Management Professional (PMI – PMP)',
    modules: [
      { title: 'Foundations of Project Management', titleAr: 'أساسيات إدارة المشاريع', lessons: [
        { en: 'Definition of a Project & Project Management', ar: 'تعريف المشروع وإدارة المشاريع' },
        { en: 'Importance of the PMP Credential', ar: 'أهمية شهادة PMP' },
        { en: 'Core Elements — Process Groups & Knowledge Areas', ar: 'العناصر الأساسية: مجموعات العمليات ومجالات المعرفة' },
        { en: 'PMBOK Overview', ar: 'نظرة عامة على PMBOK' }
      ]},
      { title: 'Managing the Project Lifecycle', titleAr: 'إدارة دورة حياة المشروع', lessons: [
        { en: 'Factors Affecting Project Success', ar: 'العوامل المؤثرة في نجاح المشروع' },
        { en: 'Planning, Executing & Monitoring Techniques', ar: 'تقنيات التخطيط والتنفيذ والمراقبة' }
      ]},
      { title: 'Certification & Practice', titleAr: 'الشهادة والممارسة', lessons: [
        { en: 'Measuring Exam Readiness', ar: 'قياس الجاهزية للاختبار' },
        { en: 'Improving Real-World Application of PMP', ar: 'تحسين التطبيق الواقعي لـ PMP' }
      ]}
    ]
  },
  {
    courseTitle: 'Corporate Treasury & Cash Flow Strategies',
    modules: [
      { title: 'Foundations of Treasury Management', titleAr: 'أساسيات إدارة الخزينة', lessons: [
        { en: 'Definition of Corporate Treasury', ar: 'تعريف الخزينة المؤسسية' },
        { en: 'Importance of Cash Flow Management', ar: 'أهمية إدارة التدفقات النقدية' },
        { en: 'Core Elements of a Treasury Function', ar: 'العناصر الأساسية لوظيفة الخزينة' },
        { en: 'Liquidity & Working Capital Basics', ar: 'أساسيات السيولة ورأس المال العامل' }
      ]},
      { title: 'Managing Cash Flow Strategically', titleAr: 'إدارة التدفق النقدي استراتيجيًا', lessons: [
        { en: 'Factors Affecting Cash Flow Stability', ar: 'العوامل المؤثرة في استقرار التدفق النقدي' },
        { en: 'Forecasting & Hedging Techniques', ar: 'تقنيات التنبؤ والتحوط' }
      ]},
      { title: 'Optimizing Treasury Performance', titleAr: 'تحسين أداء الخزينة', lessons: [
        { en: 'Measuring Treasury Efficiency', ar: 'قياس كفاءة الخزينة' },
        { en: 'Improving Banking & Funding Relationships', ar: 'تحسين العلاقات المصرفية والتمويلية' }
      ]}
    ]
  },
  {
    courseTitle: 'Certified Human Resources Manager (GAFM® – CHRM)',
    modules: [
      { title: 'Foundations of HR Management', titleAr: 'أساسيات إدارة الموارد البشرية', lessons: [
        { en: 'Definition of the HR Management Function', ar: 'تعريف وظيفة إدارة الموارد البشرية' },
        { en: 'Importance of the CHRM Credential', ar: 'أهمية شهادة CHRM' },
        { en: 'Core Elements of an HR Management System', ar: 'العناصر الأساسية لنظام إدارة الموارد البشرية' },
        { en: 'HR\'s Role Across the Employee Lifecycle', ar: 'دور الموارد البشرية عبر دورة حياة الموظف' }
      ]},
      { title: 'Managing HR Operations', titleAr: 'إدارة عمليات الموارد البشرية', lessons: [
        { en: 'Factors Affecting HR Operational Effectiveness', ar: 'العوامل المؤثرة في فعالية العمليات' },
        { en: 'Policy & Process Design Techniques', ar: 'تقنيات تصميم السياسات والعمليات' }
      ]},
      { title: 'Leading the HR Function', titleAr: 'قيادة وظيفة الموارد البشرية', lessons: [
        { en: 'Measuring HR Function Maturity', ar: 'قياس نضج وظيفة الموارد البشرية' },
        { en: 'Improving HR\'s Strategic Influence', ar: 'تحسين التأثير الاستراتيجي للموارد البشرية' }
      ]}
    ]
  },
  {
    courseTitle: 'ISO 45001 — Occupational Health & Safety Awareness',
    modules: [
      { title: 'Understanding ISO 45001', titleAr: 'مفهوم معيار ISO 45001', lessons: [
        { en: 'Definition of Occupational Health & Safety Management', ar: 'تعريف إدارة الصحة والسلامة المهنية' },
        { en: 'Importance of a Safety Management System', ar: 'أهمية نظام إدارة السلامة' },
        { en: 'Core Elements of the Standard', ar: 'العناصر الأساسية للمعيار' },
        { en: 'Hazard Identification Basics', ar: 'أساسيات تحديد المخاطر' }
      ]},
      { title: 'Implementing Safety Practices', titleAr: 'تطبيق ممارسات السلامة', lessons: [
        { en: 'Factors Affecting Workplace Safety Performance', ar: 'العوامل المؤثرة في أداء السلامة' },
        { en: 'Risk Assessment & Control Techniques', ar: 'تقنيات تقييم المخاطر والضبط' }
      ]},
      { title: 'Sustaining a Safety Culture', titleAr: 'استدامة ثقافة السلامة', lessons: [
        { en: 'Measuring Safety Performance', ar: 'قياس أداء السلامة' },
        { en: 'Improving Incident Reporting & Learning', ar: 'تحسين الإبلاغ عن الحوادث والتعلم منها' }
      ]}
    ]
  },
  {
    courseTitle: 'Operational Excellence (OPEX)',
    modules: [
      { title: 'Foundations of Operational Excellence', titleAr: 'أساسيات التميز التشغيلي', lessons: [
        { en: 'Definition of Operational Excellence', ar: 'تعريف التميز التشغيلي' },
        { en: 'Importance of an OPEX Mindset', ar: 'أهمية عقلية التميز التشغيلي' },
        { en: 'Core Elements of an OPEX Program', ar: 'العناصر الأساسية لبرنامج التميز التشغيلي' },
        { en: 'Common OPEX Frameworks', ar: 'أطر التميز التشغيلي الشائعة' }
      ]},
      { title: 'Driving Operational Improvement', titleAr: 'دفع التحسين التشغيلي', lessons: [
        { en: 'Factors Affecting OPEX Success', ar: 'العوامل المؤثرة في نجاح التميز التشغيلي' },
        { en: 'Waste Reduction & Efficiency Techniques', ar: 'تقنيات تقليل الهدر وزيادة الكفاءة' }
      ]},
      { title: 'Sustaining Excellence', titleAr: 'استدامة التميز', lessons: [
        { en: 'Measuring Operational Excellence Maturity', ar: 'قياس نضج التميز التشغيلي' },
        { en: 'Improving Cross-Department Alignment', ar: 'تحسين التوافق بين الإدارات' }
      ]}
    ]
  },
  {
    courseTitle: 'Certified Digital Transformation Officer (GAFM® – CDTO)',
    modules: [
      { title: 'Foundations of Digital Transformation', titleAr: 'أساسيات التحول الرقمي', lessons: [
        { en: 'Definition of Digital Transformation', ar: 'تعريف التحول الرقمي' },
        { en: 'Importance of the CDTO Role', ar: 'أهمية دور CDTO' },
        { en: 'Core Elements of a Transformation Strategy', ar: 'العناصر الأساسية لاستراتيجية التحول' },
        { en: 'Digital Maturity Assessment Basics', ar: 'أساسيات تقييم النضج الرقمي' }
      ]},
      { title: 'Leading Digital Change', titleAr: 'قيادة التغيير الرقمي', lessons: [
        { en: 'Factors Affecting Transformation Success', ar: 'العوامل المؤثرة في نجاح التحول' },
        { en: 'Change Management for Digital Initiatives', ar: 'إدارة التغيير للمبادرات الرقمية' }
      ]},
      { title: 'Sustaining Digital Momentum', titleAr: 'استدامة الزخم الرقمي', lessons: [
        { en: 'Measuring Digital Transformation Impact', ar: 'قياس أثر التحول الرقمي' },
        { en: 'Improving Technology Adoption Across Teams', ar: 'تحسين تبني التقنية عبر الفرق' }
      ]}
    ]
  }
];

async function main() {
  let coursesUpdated = 0, coursesNotFound = 0, modulesCreated = 0, lessonsCreated = 0;

  for (const entry of CURRICULA) {
    const course = await prisma.course.findFirst({ where: { title: entry.courseTitle } });
    if (!course) { console.log(`Not found, skipped: ${entry.courseTitle}`); coursesNotFound++; continue; }

    await prisma.module.deleteMany({ where: { courseId: course.id } });

    for (let mi = 0; mi < entry.modules.length; mi++) {
      const mod = entry.modules[mi];
      const createdModule = await prisma.module.create({
        data: { title: mod.title, titleAr: mod.titleAr, order: mi, courseId: course.id }
      });
      modulesCreated++;

      for (let li = 0; li < mod.lessons.length; li++) {
        const lesson = mod.lessons[li];
        await prisma.lesson.create({
          data: {
            title: lesson.en, titleAr: lesson.ar,
            durationSeconds: LESSON_DURATION, order: li,
            moduleId: createdModule.id
          }
        });
        lessonsCreated++;
      }
    }
    coursesUpdated++;
  }

  console.log(`Done. Updated ${coursesUpdated} courses with real curricula (${modulesCreated} modules, ${lessonsCreated} lessons). ${coursesNotFound} course titles were not found.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
