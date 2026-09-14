// Third batch — richer than the first two (3 modules per course instead
// of 2, more lessons per module) per the client's request for more
// depth. Same definition/importance/elements/factors/improvement
// pattern, extended. Run with: npm run seed:curricula3

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LESSON_DURATION = 600;

const CURRICULA = [
  {
    courseTitle: 'Corporate Ethics & Building an Anti-Fraud Culture',
    modules: [
      { title: 'Foundations of Corporate Ethics', titleAr: 'أساسيات أخلاقيات الشركات', lessons: [
        { en: 'Definition of Corporate Ethics', ar: 'تعريف أخلاقيات الشركات' },
        { en: 'Importance of an Ethical Culture', ar: 'أهمية الثقافة الأخلاقية' },
        { en: 'Core Elements of an Ethics Program', ar: 'العناصر الأساسية لبرنامج الأخلاقيات' },
        { en: 'Common Ethical Dilemmas', ar: 'المعضلات الأخلاقية الشائعة' }
      ]},
      { title: 'Building an Anti-Fraud Culture', titleAr: 'بناء ثقافة مكافحة الاحتيال', lessons: [
        { en: 'Definition of an Anti-Fraud Culture', ar: 'تعريف ثقافة مكافحة الاحتيال' },
        { en: 'Factors That Shape Organizational Culture', ar: 'العوامل المشكّلة لثقافة المؤسسة' },
        { en: 'Role of Leadership in Setting the Tone', ar: 'دور القيادة في تحديد النبرة' }
      ]},
      { title: 'Sustaining Ethical Behavior', titleAr: 'استدامة السلوك الأخلاقي', lessons: [
        { en: 'Measuring Culture & Ethics Climate', ar: 'قياس الثقافة والمناخ الأخلاقي' },
        { en: 'Improving Ethics Training Programs', ar: 'تحسين برامج التدريب الأخلاقي' }
      ]}
    ]
  },
  {
    courseTitle: 'Certified Risk & Compliance Professional (GAFM – CRCP)',
    modules: [
      { title: 'Foundations of Risk & Compliance', titleAr: 'أساسيات المخاطر والامتثال', lessons: [
        { en: 'Definition of Integrated Risk & Compliance', ar: 'تعريف المخاطر والامتثال المتكامل' },
        { en: 'Importance of the CRCP Discipline', ar: 'أهمية تخصص CRCP' },
        { en: 'Core Elements of a Combined Framework', ar: 'العناصر الأساسية لإطار متكامل' },
        { en: 'Regulatory Landscape Overview', ar: 'نظرة عامة على البيئة التنظيمية' }
      ]},
      { title: 'Applying Integrated Frameworks', titleAr: 'تطبيق الأطر المتكاملة', lessons: [
        { en: 'Factors Affecting Framework Adoption', ar: 'العوامل المؤثرة في تبني الإطار' },
        { en: 'Tools for Combined Risk-Compliance Management', ar: 'أدوات إدارة المخاطر والامتثال المشتركة' }
      ]},
      { title: 'Professional Practice', titleAr: 'الممارسة المهنية', lessons: [
        { en: 'Measuring Professional Effectiveness', ar: 'قياس الفعالية المهنية' },
        { en: 'Improving Cross-Functional Collaboration', ar: 'تحسين التعاون بين الوظائف' }
      ]}
    ]
  },
  {
    courseTitle: 'Codes of Conduct Implementation Workshops',
    modules: [
      { title: 'Understanding Codes of Conduct', titleAr: 'مفهوم مدونات السلوك', lessons: [
        { en: 'Definition of a Code of Conduct', ar: 'تعريف مدونة السلوك' },
        { en: 'Importance of a Written Code', ar: 'أهمية وجود مدونة مكتوبة' },
        { en: 'Core Elements of an Effective Code', ar: 'العناصر الأساسية لمدونة فعّالة' },
        { en: 'Common Topics Covered', ar: 'الموضوعات الشائعة المغطاة' }
      ]},
      { title: 'Implementing the Code', titleAr: 'تنفيذ المدونة', lessons: [
        { en: 'Factors Affecting Employee Adoption', ar: 'العوامل المؤثرة في تبني الموظفين' },
        { en: 'Communication & Rollout Techniques', ar: 'تقنيات التواصل والإطلاق' }
      ]},
      { title: 'Sustaining Compliance with the Code', titleAr: 'استدامة الالتزام بالمدونة', lessons: [
        { en: 'Measuring Code Awareness', ar: 'قياس الوعي بالمدونة' },
        { en: 'Improving & Updating the Code Over Time', ar: 'تحسين وتحديث المدونة عبر الوقت' }
      ]}
    ]
  },
  {
    courseTitle: 'Certified Financial Crime Specialist (GAFM – CAFC)',
    modules: [
      { title: 'Foundations of Financial Crime', titleAr: 'أساسيات الجرائم المالية', lessons: [
        { en: 'Definition of Financial Crime', ar: 'تعريف الجريمة المالية' },
        { en: 'Importance of Specialist Expertise', ar: 'أهمية الخبرة المتخصصة' },
        { en: 'Core Elements of Financial Crime Typologies', ar: 'العناصر الأساسية لأنماط الجريمة المالية' },
        { en: 'Overview of Regulatory Bodies', ar: 'نظرة عامة على الجهات التنظيمية' }
      ]},
      { title: 'Detecting & Responding', titleAr: 'الكشف والاستجابة', lessons: [
        { en: 'Factors Affecting Detection Capability', ar: 'العوامل المؤثرة في قدرة الكشف' },
        { en: 'Response & Escalation Techniques', ar: 'تقنيات الاستجابة والتصعيد' }
      ]},
      { title: 'Professional Application', titleAr: 'التطبيق المهني', lessons: [
        { en: 'Measuring Program Maturity', ar: 'قياس نضج البرنامج' },
        { en: 'Improving Cross-Border Cooperation', ar: 'تحسين التعاون العابر للحدود' }
      ]}
    ]
  },
  {
    courseTitle: 'PRINCE2® Certification (ILX Group)',
    modules: [
      { title: 'Foundations of PRINCE2', titleAr: 'أساسيات PRINCE2', lessons: [
        { en: 'Definition of the PRINCE2 Methodology', ar: 'تعريف منهجية PRINCE2' },
        { en: 'Importance of a Structured Methodology', ar: 'أهمية المنهجية المنظمة' },
        { en: 'Core Elements — Principles, Themes, Processes', ar: 'العناصر الأساسية: المبادئ، الموضوعات، العمليات' },
        { en: 'Comparing PRINCE2 to Other Methodologies', ar: 'مقارنة PRINCE2 بمنهجيات أخرى' }
      ]},
      { title: 'Applying PRINCE2 in Practice', titleAr: 'تطبيق PRINCE2 عمليًا', lessons: [
        { en: 'Factors Affecting Successful Adoption', ar: 'العوامل المؤثرة في التبني الناجح' },
        { en: 'Tailoring PRINCE2 to Project Scale', ar: 'تكييف PRINCE2 حسب حجم المشروع' }
      ]},
      { title: 'Certification Path', titleAr: 'مسار الشهادة', lessons: [
        { en: 'Measuring Readiness for Certification', ar: 'قياس الجاهزية للشهادة' },
        { en: 'Improving Exam Preparation Techniques', ar: 'تحسين تقنيات التحضير للاختبار' }
      ]}
    ]
  },
  {
    courseTitle: 'IFRS & Local Reporting Standards Training',
    modules: [
      { title: 'Understanding IFRS', titleAr: 'مفهوم معايير IFRS', lessons: [
        { en: 'Definition of IFRS', ar: 'تعريف معايير التقارير المالية الدولية' },
        { en: 'Importance of Standardized Reporting', ar: 'أهمية التقارير الموحدة' },
        { en: 'Core Elements of Key Standards', ar: 'العناصر الأساسية للمعايير الرئيسية' },
        { en: 'Differences from Local GAAP', ar: 'الفروقات عن المعايير المحلية' }
      ]},
      { title: 'Applying IFRS Locally', titleAr: 'تطبيق IFRS محليًا', lessons: [
        { en: 'Factors Affecting Local Adoption', ar: 'العوامل المؤثرة في التبني المحلي' },
        { en: 'Transition & Reconciliation Techniques', ar: 'تقنيات الانتقال والمطابقة' }
      ]},
      { title: 'Reporting Practice', titleAr: 'ممارسة إعداد التقارير', lessons: [
        { en: 'Measuring Reporting Quality', ar: 'قياس جودة التقارير' },
        { en: 'Improving Disclosure Practices', ar: 'تحسين ممارسات الإفصاح' }
      ]}
    ]
  },
  {
    courseTitle: 'Strategic Human Capital Management',
    modules: [
      { title: 'Foundations of Strategic HCM', titleAr: 'أساسيات إدارة رأس المال البشري الاستراتيجي', lessons: [
        { en: 'Definition of Human Capital Management', ar: 'تعريف إدارة رأس المال البشري' },
        { en: 'Importance of a Strategic Approach', ar: 'أهمية النهج الاستراتيجي' },
        { en: 'Core Elements of an HCM Strategy', ar: 'العناصر الأساسية لاستراتيجية رأس المال البشري' },
        { en: 'Aligning HCM with Business Strategy', ar: 'مواءمة رأس المال البشري مع استراتيجية العمل' }
      ]},
      { title: 'Executing the Strategy', titleAr: 'تنفيذ الاستراتيجية', lessons: [
        { en: 'Factors Affecting Strategic Execution', ar: 'العوامل المؤثرة في التنفيذ الاستراتيجي' },
        { en: 'Workforce Planning Techniques', ar: 'تقنيات تخطيط القوى العاملة' }
      ]},
      { title: 'Measuring Impact', titleAr: 'قياس الأثر', lessons: [
        { en: 'Measuring Human Capital ROI', ar: 'قياس عائد الاستثمار في رأس المال البشري' },
        { en: 'Improving Strategic HR Reporting', ar: 'تحسين تقارير الموارد البشرية الاستراتيجية' }
      ]}
    ]
  },
  {
    courseTitle: 'ISO 14001 — Environmental Management Awareness',
    modules: [
      { title: 'Understanding ISO 14001', titleAr: 'مفهوم معيار ISO 14001', lessons: [
        { en: 'Definition of Environmental Management Systems', ar: 'تعريف أنظمة الإدارة البيئية' },
        { en: 'Importance of Environmental Compliance', ar: 'أهمية الامتثال البيئي' },
        { en: 'Core Elements of the Standard', ar: 'العناصر الأساسية للمعيار' },
        { en: 'Environmental Impact Assessment Basics', ar: 'أساسيات تقييم الأثر البيئي' }
      ]},
      { title: 'Implementing Environmental Practices', titleAr: 'تطبيق الممارسات البيئية', lessons: [
        { en: 'Factors Affecting Environmental Performance', ar: 'العوامل المؤثرة في الأداء البيئي' },
        { en: 'Practical Reduction & Compliance Techniques', ar: 'تقنيات التخفيض والامتثال العملية' }
      ]},
      { title: 'Sustaining Environmental Management', titleAr: 'استدامة الإدارة البيئية', lessons: [
        { en: 'Measuring Environmental Performance', ar: 'قياس الأداء البيئي' },
        { en: 'Improving Continuous Environmental Practices', ar: 'تحسين الممارسات البيئية المستمرة' }
      ]}
    ]
  },
  {
    courseTitle: 'Continuous Improvement & Leading Operations Teams',
    modules: [
      { title: 'Foundations of Continuous Improvement', titleAr: 'أساسيات التحسين المستمر', lessons: [
        { en: 'Definition of Continuous Improvement', ar: 'تعريف التحسين المستمر' },
        { en: 'Importance of a Continuous Improvement Mindset', ar: 'أهمية عقلية التحسين المستمر' },
        { en: 'Core Elements & Common Methodologies', ar: 'العناصر الأساسية والمنهجيات الشائعة' },
        { en: 'Kaizen & PDCA Basics', ar: 'أساسيات Kaizen وPDCA' }
      ]},
      { title: 'Leading Operations Teams', titleAr: 'قيادة فرق العمليات', lessons: [
        { en: 'Factors Affecting Team Performance', ar: 'العوامل المؤثرة في أداء الفريق' },
        { en: 'Techniques for Engaging Frontline Teams', ar: 'تقنيات إشراك الفرق التشغيلية' }
      ]},
      { title: 'Sustaining Improvement', titleAr: 'استدامة التحسين', lessons: [
        { en: 'Measuring Improvement Impact', ar: 'قياس أثر التحسين' },
        { en: 'Improving Team-Led Problem Solving', ar: 'تحسين حل المشكلات بقيادة الفريق' }
      ]}
    ]
  },
  {
    courseTitle: 'CISA — Certified Information Systems Auditor',
    modules: [
      { title: 'Foundations of IS Auditing', titleAr: 'أساسيات تدقيق نظم المعلومات', lessons: [
        { en: 'Definition of Information Systems Auditing', ar: 'تعريف تدقيق نظم المعلومات' },
        { en: 'Importance of the CISA Credential', ar: 'أهمية شهادة CISA' },
        { en: 'Core Elements of the Audit Process', ar: 'العناصر الأساسية لعملية التدقيق' },
        { en: 'CISA Domain Overview', ar: 'نظرة عامة على مجالات CISA' }
      ]},
      { title: 'Conducting IS Audits', titleAr: 'إجراء تدقيق نظم المعلومات', lessons: [
        { en: 'Factors Affecting Audit Scope & Risk', ar: 'العوامل المؤثرة في نطاق التدقيق والمخاطر' },
        { en: 'IT Governance & Control Testing Techniques', ar: 'تقنيات اختبار حوكمة وضوابط تقنية المعلومات' }
      ]},
      { title: 'Professional Practice', titleAr: 'الممارسة المهنية', lessons: [
        { en: 'Measuring Audit Quality', ar: 'قياس جودة التدقيق' },
        { en: 'Improving Audit Reporting & Follow-Up', ar: 'تحسين تقارير التدقيق والمتابعة' }
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
