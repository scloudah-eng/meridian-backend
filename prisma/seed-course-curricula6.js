// Sixth batch — same rich 3-module pattern as batches 3-5.
// Run with: npm run seed:curricula6

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LESSON_DURATION = 600;

const CURRICULA = [
  {
    courseTitle: 'Certified Fraud Examiner (CFE) — Awareness Track',
    modules: [
      { title: 'Foundations of Fraud Examination', titleAr: 'أساسيات فحص الاحتيال', lessons: [
        { en: 'Definition of Fraud Examination', ar: 'تعريف فحص الاحتيال' },
        { en: 'Importance of CFE Awareness', ar: 'أهمية التوعية بـ CFE' },
        { en: 'Core Elements of the Fraud Triangle', ar: 'العناصر الأساسية لمثلث الاحتيال' },
        { en: 'Overview of the CFE Body of Knowledge', ar: 'نظرة عامة على محتوى معرفة CFE' }
      ]},
      { title: 'Recognizing Fraud Schemes', titleAr: 'التعرف على مخططات الاحتيال', lessons: [
        { en: 'Factors Affecting Fraud Vulnerability', ar: 'العوامل المؤثرة في التعرض للاحتيال' },
        { en: 'Awareness Techniques for Non-Examiners', ar: 'تقنيات التوعية لغير الفاحصين' }
      ]},
      { title: 'Building Awareness Culture', titleAr: 'بناء ثقافة التوعية', lessons: [
        { en: 'Measuring Organizational Fraud Awareness', ar: 'قياس وعي المؤسسة بالاحتيال' },
        { en: 'Improving Awareness Program Reach', ar: 'تحسين انتشار برنامج التوعية' }
      ]}
    ]
  },
  {
    courseTitle: 'AML & Fraud Awareness',
    modules: [
      { title: 'Foundations of Combined AML-Fraud Awareness', titleAr: 'أساسيات التوعية المشتركة بمكافحة غسل الأموال والاحتيال', lessons: [
        { en: 'Definition of Combined AML-Fraud Risk', ar: 'تعريف مخاطر غسل الأموال والاحتيال المشتركة' },
        { en: 'Importance of Integrated Awareness', ar: 'أهمية التوعية المتكاملة' },
        { en: 'Core Elements of Awareness Programs', ar: 'العناصر الأساسية لبرامج التوعية' },
        { en: 'Overlap Between AML and Fraud Typologies', ar: 'التداخل بين أنماط غسل الأموال والاحتيال' }
      ]},
      { title: 'Recognizing Warning Signs', titleAr: 'التعرف على علامات الإنذار', lessons: [
        { en: 'Factors Affecting Staff Vigilance', ar: 'العوامل المؤثرة في يقظة الموظفين' },
        { en: 'Reporting & Escalation Techniques', ar: 'تقنيات الإبلاغ والتصعيد' }
      ]},
      { title: 'Sustaining Awareness', titleAr: 'استدامة التوعية', lessons: [
        { en: 'Measuring Awareness Program Effectiveness', ar: 'قياس فعالية برنامج التوعية' },
        { en: 'Improving Refresher Training Cycles', ar: 'تحسين دورات التدريب التذكيري' }
      ]}
    ]
  },
  {
    courseTitle: 'Ethical Internal Audit & Integrity Reporting',
    modules: [
      { title: 'Foundations of Ethical Auditing', titleAr: 'أساسيات التدقيق الأخلاقي', lessons: [
        { en: 'Definition of Ethical Internal Audit', ar: 'تعريف التدقيق الداخلي الأخلاقي' },
        { en: 'Importance of Integrity in Audit Work', ar: 'أهمية النزاهة في عمل التدقيق' },
        { en: 'Core Elements of Integrity Reporting', ar: 'العناصر الأساسية لتقارير النزاهة' },
        { en: 'Auditor Independence Basics', ar: 'أساسيات استقلالية المدقق' }
      ]},
      { title: 'Conducting Integrity-Focused Audits', titleAr: 'إجراء تدقيق يركّز على النزاهة', lessons: [
        { en: 'Factors Affecting Audit Objectivity', ar: 'العوامل المؤثرة في موضوعية التدقيق' },
        { en: 'Techniques for Assessing Ethical Controls', ar: 'تقنيات تقييم الضوابط الأخلاقية' }
      ]},
      { title: 'Reporting & Follow-Up', titleAr: 'إعداد التقارير والمتابعة', lessons: [
        { en: 'Measuring Integrity Reporting Quality', ar: 'قياس جودة تقارير النزاهة' },
        { en: 'Improving Stakeholder Communication', ar: 'تحسين التواصل مع أصحاب المصلحة' }
      ]}
    ]
  },
  {
    courseTitle: 'FATF Principles & Guidance Interpretation Workshops',
    modules: [
      { title: 'Foundations of FATF Standards', titleAr: 'أساسيات معايير FATF', lessons: [
        { en: 'Definition of FATF & Its Role', ar: 'تعريف FATF ودورها' },
        { en: 'Importance of FATF Compliance', ar: 'أهمية الامتثال لمعايير FATF' },
        { en: 'Core Elements of the FATF Recommendations', ar: 'العناصر الأساسية لتوصيات FATF' },
        { en: 'Mutual Evaluation Basics', ar: 'أساسيات التقييم المتبادل' }
      ]},
      { title: 'Interpreting & Applying Guidance', titleAr: 'تفسير وتطبيق الإرشادات', lessons: [
        { en: 'Factors Affecting National Implementation', ar: 'العوامل المؤثرة في التطبيق الوطني' },
        { en: 'Practical Interpretation Techniques', ar: 'تقنيات التفسير العملي' }
      ]},
      { title: 'Staying Current with FATF', titleAr: 'مواكبة تحديثات FATF', lessons: [
        { en: 'Measuring Institutional FATF Readiness', ar: 'قياس جاهزية المؤسسة لمعايير FATF' },
        { en: 'Improving Monitoring of Guidance Updates', ar: 'تحسين متابعة تحديثات الإرشادات' }
      ]}
    ]
  },
  {
    courseTitle: 'Certified International Project Manager (GAFM – CIPM)',
    modules: [
      { title: 'Foundations of International Project Management', titleAr: 'أساسيات إدارة المشاريع الدولية', lessons: [
        { en: 'Definition of International Project Management', ar: 'تعريف إدارة المشاريع الدولية' },
        { en: 'Importance of the CIPM Credential', ar: 'أهمية شهادة CIPM' },
        { en: 'Core Elements of Cross-Border Project Work', ar: 'العناصر الأساسية للعمل في مشاريع عابرة للحدود' },
        { en: 'Cultural & Regulatory Considerations', ar: 'الاعتبارات الثقافية والتنظيمية' }
      ]},
      { title: 'Managing Global Project Teams', titleAr: 'إدارة فرق المشاريع العالمية', lessons: [
        { en: 'Factors Affecting Cross-Cultural Team Performance', ar: 'العوامل المؤثرة في أداء الفرق متعددة الثقافات' },
        { en: 'Remote & Distributed Team Techniques', ar: 'تقنيات الفرق عن بُعد والموزّعة' }
      ]},
      { title: 'International Project Governance', titleAr: 'حوكمة المشاريع الدولية', lessons: [
        { en: 'Measuring International Project Success', ar: 'قياس نجاح المشروع الدولي' },
        { en: 'Improving Cross-Border Reporting', ar: 'تحسين التقارير العابرة للحدود' }
      ]}
    ]
  },
  {
    courseTitle: 'Feasibility Study Labs — Applied Simulation',
    modules: [
      { title: 'Foundations of Feasibility Studies', titleAr: 'أساسيات دراسات الجدوى', lessons: [
        { en: 'Definition of a Feasibility Study', ar: 'تعريف دراسة الجدوى' },
        { en: 'Importance of Feasibility Analysis Before Investment', ar: 'أهمية تحليل الجدوى قبل الاستثمار' },
        { en: 'Core Elements of a Feasibility Study', ar: 'العناصر الأساسية لدراسة الجدوى' },
        { en: 'Types of Feasibility (Market, Technical, Financial)', ar: 'أنواع الجدوى (سوقية، فنية، مالية)' }
      ]},
      { title: 'Conducting the Analysis', titleAr: 'إجراء التحليل', lessons: [
        { en: 'Factors Affecting Study Accuracy', ar: 'العوامل المؤثرة في دقة الدراسة' },
        { en: 'Applied Simulation Techniques', ar: 'تقنيات المحاكاة التطبيقية' }
      ]},
      { title: 'Decision Support', titleAr: 'دعم اتخاذ القرار', lessons: [
        { en: 'Measuring Study Reliability', ar: 'قياس موثوقية الدراسة' },
        { en: 'Improving Investment Decision Reports', ar: 'تحسين تقارير قرارات الاستثمار' }
      ]}
    ]
  },
  {
    courseTitle: 'Labor Law Fundamentals (Saudi / GCC)',
    modules: [
      { title: 'Foundations of Labor Law', titleAr: 'أساسيات قانون العمل', lessons: [
        { en: 'Definition of Key Labor Law Concepts', ar: 'تعريف المفاهيم الأساسية لقانون العمل' },
        { en: 'Importance of Labor Law Compliance', ar: 'أهمية الامتثال لقانون العمل' },
        { en: 'Core Elements of Saudi/GCC Labor Regulations', ar: 'العناصر الأساسية لأنظمة العمل السعودية/الخليجية' },
        { en: 'Employee Rights & Obligations Overview', ar: 'نظرة عامة على حقوق والتزامات الموظف' }
      ]},
      { title: 'Applying Labor Law in Practice', titleAr: 'تطبيق قانون العمل عمليًا', lessons: [
        { en: 'Factors Affecting Compliance Risk', ar: 'العوامل المؤثرة في مخاطر عدم الامتثال' },
        { en: 'Handling Common Labor Disputes', ar: 'التعامل مع منازعات العمل الشائعة' }
      ]},
      { title: 'Sustaining Compliance', titleAr: 'استدامة الامتثال', lessons: [
        { en: 'Measuring HR Legal Compliance', ar: 'قياس الامتثال القانوني للموارد البشرية' },
        { en: 'Improving Policy Alignment with Labor Law', ar: 'تحسين مواءمة السياسات مع قانون العمل' }
      ]}
    ]
  },
  {
    courseTitle: 'Green Belt / Yellow Belt — Six Sigma Concepts',
    modules: [
      { title: 'Foundations of Six Sigma', titleAr: 'أساسيات Six Sigma', lessons: [
        { en: 'Definition of Six Sigma', ar: 'تعريف Six Sigma' },
        { en: 'Importance of the Belt System', ar: 'أهمية نظام الأحزمة' },
        { en: 'Core Elements of DMAIC', ar: 'العناصر الأساسية لـ DMAIC' },
        { en: 'Yellow vs Green Belt Scope', ar: 'نطاق الحزام الأصفر مقابل الأخضر' }
      ]},
      { title: 'Applying Six Sigma Tools', titleAr: 'تطبيق أدوات Six Sigma', lessons: [
        { en: 'Factors Affecting Project Selection', ar: 'العوامل المؤثرة في اختيار المشروع' },
        { en: 'Statistical & Process Tools Overview', ar: 'نظرة عامة على الأدوات الإحصائية والتشغيلية' }
      ]},
      { title: 'Sustaining Six Sigma Practice', titleAr: 'استدامة ممارسة Six Sigma', lessons: [
        { en: 'Measuring Six Sigma Project Impact', ar: 'قياس أثر مشروع Six Sigma' },
        { en: 'Improving Belt-Holder Practice Over Time', ar: 'تحسين ممارسة حامل الحزام بمرور الوقت' }
      ]}
    ]
  },
  {
    courseTitle: 'Operational Risk in Service Delivery',
    modules: [
      { title: 'Foundations of Operational Risk', titleAr: 'أساسيات المخاطر التشغيلية', lessons: [
        { en: 'Definition of Operational Risk in Services', ar: 'تعريف المخاطر التشغيلية في الخدمات' },
        { en: 'Importance of Managing Service Delivery Risk', ar: 'أهمية إدارة مخاطر تقديم الخدمة' },
        { en: 'Core Elements of an Operational Risk Framework', ar: 'العناصر الأساسية لإطار المخاطر التشغيلية' },
        { en: 'Common Service Delivery Failure Points', ar: 'نقاط الفشل الشائعة في تقديم الخدمة' }
      ]},
      { title: 'Managing Service Risk', titleAr: 'إدارة مخاطر الخدمة', lessons: [
        { en: 'Factors Affecting Risk Exposure in Delivery', ar: 'العوامل المؤثرة في التعرض للمخاطر أثناء التقديم' },
        { en: 'Risk Mitigation Techniques for Service Teams', ar: 'تقنيات تخفيف المخاطر لفرق الخدمة' }
      ]},
      { title: 'Sustaining Service Reliability', titleAr: 'استدامة موثوقية الخدمة', lessons: [
        { en: 'Measuring Operational Risk Exposure', ar: 'قياس التعرض للمخاطر التشغيلية' },
        { en: 'Improving Incident Response in Service Delivery', ar: 'تحسين الاستجابة للحوادث في تقديم الخدمة' }
      ]}
    ]
  },
  {
    courseTitle: 'Advanced Excel for Data Analysis',
    modules: [
      { title: 'Foundations of Advanced Excel', titleAr: 'أساسيات Excel المتقدم', lessons: [
        { en: 'Definition of Data Analysis in Excel', ar: 'تعريف تحليل البيانات في Excel' },
        { en: 'Importance of Advanced Excel Skills', ar: 'أهمية مهارات Excel المتقدمة' },
        { en: 'Core Elements — Formulas, PivotTables, Functions', ar: 'العناصر الأساسية: الصيغ، الجداول المحورية، الدوال' },
        { en: 'Data Cleaning Basics', ar: 'أساسيات تنظيف البيانات' }
      ]},
      { title: 'Applying Advanced Analysis Techniques', titleAr: 'تطبيق تقنيات التحليل المتقدمة', lessons: [
        { en: 'Factors Affecting Analysis Accuracy', ar: 'العوامل المؤثرة في دقة التحليل' },
        { en: 'Advanced Formulas & What-If Analysis', ar: 'الصيغ المتقدمة وتحليل ماذا-لو' }
      ]},
      { title: 'Presenting Insights', titleAr: 'عرض الرؤى', lessons: [
        { en: 'Measuring Analysis Impact on Decisions', ar: 'قياس أثر التحليل على القرارات' },
        { en: 'Improving Data Visualization in Excel', ar: 'تحسين تصور البيانات في Excel' }
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
