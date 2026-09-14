// Fifth batch — same rich 3-module pattern as batches 3-4.
// Run with: npm run seed:curricula5

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LESSON_DURATION = 600;

const CURRICULA = [
  {
    courseTitle: 'Certified Fraud Analyst (GAFM® – ChFA)',
    modules: [
      { title: 'Foundations of Fraud Analysis', titleAr: 'أساسيات تحليل الاحتيال', lessons: [
        { en: 'Definition of Fraud Analysis', ar: 'تعريف تحليل الاحتيال' },
        { en: 'Importance of the ChFA Credential', ar: 'أهمية شهادة ChFA' },
        { en: 'Core Elements of a Fraud Analysis Framework', ar: 'العناصر الأساسية لإطار تحليل الاحتيال' },
        { en: 'Common Fraud Schemes Overview', ar: 'نظرة عامة على مخططات الاحتيال الشائعة' }
      ]},
      { title: 'Applying Analytical Techniques', titleAr: 'تطبيق التقنيات التحليلية', lessons: [
        { en: 'Factors Affecting Analytical Accuracy', ar: 'العوامل المؤثرة في دقة التحليل' },
        { en: 'Data Analytics for Fraud Detection', ar: 'تحليلات البيانات للكشف عن الاحتيال' }
      ]},
      { title: 'Professional Practice', titleAr: 'الممارسة المهنية', lessons: [
        { en: 'Measuring Analyst Performance', ar: 'قياس أداء المحلل' },
        { en: 'Improving Analytical Reporting', ar: 'تحسين التقارير التحليلية' }
      ]}
    ]
  },
  {
    courseTitle: 'Risk-Based Internal Audit Programs',
    modules: [
      { title: 'Foundations of Risk-Based Auditing', titleAr: 'أساسيات التدقيق القائم على المخاطر', lessons: [
        { en: 'Definition of Risk-Based Internal Audit', ar: 'تعريف التدقيق الداخلي القائم على المخاطر' },
        { en: 'Importance of a Risk-Based Approach', ar: 'أهمية النهج القائم على المخاطر' },
        { en: 'Core Elements of an Audit Universe', ar: 'العناصر الأساسية لعالم التدقيق' },
        { en: 'Building a Risk-Based Audit Plan', ar: 'بناء خطة تدقيق قائمة على المخاطر' }
      ]},
      { title: 'Executing Risk-Based Audits', titleAr: 'تنفيذ التدقيق القائم على المخاطر', lessons: [
        { en: 'Factors Affecting Audit Prioritization', ar: 'العوامل المؤثرة في ترتيب أولويات التدقيق' },
        { en: 'Testing & Evidence-Gathering Techniques', ar: 'تقنيات الاختبار وجمع الأدلة' }
      ]},
      { title: 'Sustaining the Program', titleAr: 'استدامة البرنامج', lessons: [
        { en: 'Measuring Audit Program Value', ar: 'قياس قيمة برنامج التدقيق' },
        { en: 'Improving Follow-Up on Audit Findings', ar: 'تحسين متابعة نتائج التدقيق' }
      ]}
    ]
  },
  {
    courseTitle: 'Board & Executive Ethics',
    modules: [
      { title: 'Foundations of Board Ethics', titleAr: 'أساسيات أخلاقيات مجالس الإدارة', lessons: [
        { en: 'Definition of Board & Executive Ethics', ar: 'تعريف أخلاقيات المجلس والتنفيذيين' },
        { en: 'Importance of Tone at the Top', ar: 'أهمية النبرة من القمة' },
        { en: 'Core Elements of Board Governance Ethics', ar: 'العناصر الأساسية لأخلاقيات حوكمة المجلس' },
        { en: 'Fiduciary Duty Basics', ar: 'أساسيات الواجب الائتماني' }
      ]},
      { title: 'Managing Ethical Risk at the Top', titleAr: 'إدارة المخاطر الأخلاقية في القمة', lessons: [
        { en: 'Factors Affecting Executive Ethical Decisions', ar: 'العوامل المؤثرة في القرارات الأخلاقية التنفيذية' },
        { en: 'Conflict-of-Interest Management Techniques', ar: 'تقنيات إدارة تضارب المصالح' }
      ]},
      { title: 'Sustaining Ethical Governance', titleAr: 'استدامة الحوكمة الأخلاقية', lessons: [
        { en: 'Measuring Board Ethical Climate', ar: 'قياس المناخ الأخلاقي للمجلس' },
        { en: 'Improving Executive Accountability Practices', ar: 'تحسين ممارسات مساءلة التنفيذيين' }
      ]}
    ]
  },
  {
    courseTitle: 'Money Laundering & Cybercrime Awareness (ISC2)',
    modules: [
      { title: 'Foundations of Cyber-Enabled Financial Crime', titleAr: 'أساسيات الجرائم المالية المرتبطة بالفضاء السيبراني', lessons: [
        { en: 'Definition of Cyber-Enabled Money Laundering', ar: 'تعريف غسل الأموال المرتبط بالفضاء السيبراني' },
        { en: 'Importance of Combined AML-Cyber Awareness', ar: 'أهمية الوعي المشترك بمكافحة غسل الأموال والأمن السيبراني' },
        { en: 'Core Elements of Cybercrime Typologies', ar: 'العناصر الأساسية لأنماط الجرائم السيبرانية' },
        { en: 'Digital Payment Channel Risks', ar: 'مخاطر قنوات الدفع الرقمية' }
      ]},
      { title: 'Detecting Cyber-Enabled Laundering', titleAr: 'كشف غسل الأموال المرتبط بالفضاء السيبراني', lessons: [
        { en: 'Factors Affecting Detection in Digital Channels', ar: 'العوامل المؤثرة في الكشف عبر القنوات الرقمية' },
        { en: 'Cross-Team Collaboration Techniques', ar: 'تقنيات التعاون بين الفرق' }
      ]},
      { title: 'Strengthening Awareness', titleAr: 'تعزيز الوعي', lessons: [
        { en: 'Measuring Staff Awareness Levels', ar: 'قياس مستويات وعي الموظفين' },
        { en: 'Improving Ongoing Awareness Training', ar: 'تحسين برامج التوعية المستمرة' }
      ]}
    ]
  },
  {
    courseTitle: 'Master of Project Management (GAFM – MPM)',
    modules: [
      { title: 'Advanced Foundations of Project Management', titleAr: 'أساسيات متقدمة لإدارة المشاريع', lessons: [
        { en: 'Definition of Advanced Project Management Practice', ar: 'تعريف الممارسة المتقدمة لإدارة المشاريع' },
        { en: 'Importance of the MPM Credential', ar: 'أهمية شهادة MPM' },
        { en: 'Core Elements of Strategic Project Leadership', ar: 'العناصر الأساسية للقيادة الاستراتيجية للمشاريع' },
        { en: 'Portfolio-Level Thinking for Project Managers', ar: 'التفكير على مستوى المحفظة لمديري المشاريع' }
      ]},
      { title: 'Leading Complex Projects', titleAr: 'قيادة المشاريع المعقدة', lessons: [
        { en: 'Factors Affecting Complex Project Outcomes', ar: 'العوامل المؤثرة في نتائج المشاريع المعقدة' },
        { en: 'Advanced Stakeholder & Risk Techniques', ar: 'تقنيات متقدمة لأصحاب المصلحة والمخاطر' }
      ]},
      { title: 'Executive Project Leadership', titleAr: 'القيادة التنفيذية للمشاريع', lessons: [
        { en: 'Measuring Strategic Project Impact', ar: 'قياس الأثر الاستراتيجي للمشروع' },
        { en: 'Improving Executive Reporting on Projects', ar: 'تحسين التقارير التنفيذية للمشاريع' }
      ]}
    ]
  },
  {
    courseTitle: 'Financial Compliance & Internal Controls Awareness',
    modules: [
      { title: 'Foundations of Financial Compliance', titleAr: 'أساسيات الامتثال المالي', lessons: [
        { en: 'Definition of Financial Compliance', ar: 'تعريف الامتثال المالي' },
        { en: 'Importance of Internal Controls', ar: 'أهمية الرقابة الداخلية' },
        { en: 'Core Elements of a Controls Framework', ar: 'العناصر الأساسية لإطار الضوابط' },
        { en: 'COSO Framework Basics', ar: 'أساسيات إطار COSO' }
      ]},
      { title: 'Applying Internal Controls', titleAr: 'تطبيق الرقابة الداخلية', lessons: [
        { en: 'Factors Affecting Control Effectiveness', ar: 'العوامل المؤثرة في فعالية الضوابط' },
        { en: 'Control Testing Techniques', ar: 'تقنيات اختبار الضوابط' }
      ]},
      { title: 'Sustaining Compliance', titleAr: 'استدامة الامتثال', lessons: [
        { en: 'Measuring Controls Maturity', ar: 'قياس نضج الضوابط' },
        { en: 'Improving Financial Compliance Culture', ar: 'تحسين ثقافة الامتثال المالي' }
      ]}
    ]
  },
  {
    courseTitle: 'HR Analytics & Leadership Dashboards',
    modules: [
      { title: 'Foundations of HR Analytics', titleAr: 'أساسيات تحليلات الموارد البشرية', lessons: [
        { en: 'Definition of HR Analytics', ar: 'تعريف تحليلات الموارد البشرية' },
        { en: 'Importance of Data-Driven HR Decisions', ar: 'أهمية القرارات المبنية على البيانات' },
        { en: 'Core Elements of an HR Dashboard', ar: 'العناصر الأساسية للوحة الموارد البشرية' },
        { en: 'Key HR Metrics Overview', ar: 'نظرة عامة على مؤشرات الموارد البشرية الرئيسية' }
      ]},
      { title: 'Building Leadership Dashboards', titleAr: 'بناء لوحات القيادة', lessons: [
        { en: 'Factors Affecting Dashboard Adoption', ar: 'العوامل المؤثرة في تبني اللوحة' },
        { en: 'Data Visualization Techniques for HR', ar: 'تقنيات تصور البيانات للموارد البشرية' }
      ]},
      { title: 'Driving Decisions with Analytics', titleAr: 'دفع القرارات بالتحليلات', lessons: [
        { en: 'Measuring Analytics Impact on Decisions', ar: 'قياس أثر التحليلات على القرارات' },
        { en: 'Improving Data Quality & Governance', ar: 'تحسين جودة البيانات وحوكمتها' }
      ]}
    ]
  },
  {
    courseTitle: 'Building Performance Indicators & a Culture of Excellence',
    modules: [
      { title: 'Foundations of Performance Indicators', titleAr: 'أساسيات مؤشرات الأداء', lessons: [
        { en: 'Definition of a Performance Indicator', ar: 'تعريف مؤشر الأداء' },
        { en: 'Importance of Meaningful KPIs', ar: 'أهمية مؤشرات الأداء ذات المعنى' },
        { en: 'Core Elements of a Good Indicator', ar: 'العناصر الأساسية للمؤشر الجيد' },
        { en: 'Leading vs Lagging Indicators', ar: 'المؤشرات القائدة مقابل المتأخرة' }
      ]},
      { title: 'Building a Culture of Excellence', titleAr: 'بناء ثقافة التميز', lessons: [
        { en: 'Factors Affecting Culture Change', ar: 'العوامل المؤثرة في تغيير الثقافة' },
        { en: 'Techniques for Embedding Excellence', ar: 'تقنيات ترسيخ التميز' }
      ]},
      { title: 'Sustaining Performance Culture', titleAr: 'استدامة ثقافة الأداء', lessons: [
        { en: 'Measuring Culture of Excellence Maturity', ar: 'قياس نضج ثقافة التميز' },
        { en: 'Improving Indicator Review Cycles', ar: 'تحسين دورات مراجعة المؤشرات' }
      ]}
    ]
  },
  {
    courseTitle: 'Measuring & Developing Performance Indicators',
    modules: [
      { title: 'Foundations of Performance Measurement', titleAr: 'أساسيات قياس الأداء', lessons: [
        { en: 'Definition of Performance Measurement', ar: 'تعريف قياس الأداء' },
        { en: 'Importance of Accurate Measurement', ar: 'أهمية القياس الدقيق' },
        { en: 'Core Elements of a Measurement System', ar: 'العناصر الأساسية لنظام القياس' },
        { en: 'Common Measurement Pitfalls', ar: 'أخطاء القياس الشائعة' }
      ]},
      { title: 'Developing Effective Indicators', titleAr: 'تطوير مؤشرات فعّالة', lessons: [
        { en: 'Factors Affecting Indicator Relevance', ar: 'العوامل المؤثرة في ملاءمة المؤشر' },
        { en: 'Techniques for Indicator Design', ar: 'تقنيات تصميم المؤشرات' }
      ]},
      { title: 'Sustaining Measurement Practice', titleAr: 'استدامة ممارسة القياس', lessons: [
        { en: 'Measuring the Measurement System Itself', ar: 'قياس نظام القياس نفسه' },
        { en: 'Improving Indicator Review & Refresh', ar: 'تحسين مراجعة وتحديث المؤشرات' }
      ]}
    ]
  },
  {
    courseTitle: 'Power BI for Business Users',
    modules: [
      { title: 'Foundations of Power BI', titleAr: 'أساسيات Power BI', lessons: [
        { en: 'Definition of Business Intelligence & Power BI', ar: 'تعريف ذكاء الأعمال وPower BI' },
        { en: 'Importance of Self-Service BI for Business Users', ar: 'أهمية ذكاء الأعمال الذاتي لمستخدمي الأعمال' },
        { en: 'Core Elements of the Power BI Interface', ar: 'العناصر الأساسية لواجهة Power BI' },
        { en: 'Connecting & Shaping Data Basics', ar: 'أساسيات الاتصال بالبيانات وتشكيلها' }
      ]},
      { title: 'Building Reports & Dashboards', titleAr: 'بناء التقارير ولوحات المعلومات', lessons: [
        { en: 'Factors Affecting Report Usability', ar: 'العوامل المؤثرة في قابلية استخدام التقرير' },
        { en: 'Visualization & DAX Basics', ar: 'أساسيات التصور وDAX' }
      ]},
      { title: 'Driving Adoption', titleAr: 'دفع التبني', lessons: [
        { en: 'Measuring Dashboard Usage', ar: 'قياس استخدام اللوحة' },
        { en: 'Improving Report Sharing & Governance', ar: 'تحسين مشاركة التقارير وحوكمتها' }
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
