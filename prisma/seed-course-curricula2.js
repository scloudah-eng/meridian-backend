// Second batch — same pattern as seed-course-curricula.js, covering the
// next 10 courses. Run with: npm run seed:curricula2

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LESSON_DURATION = 600;

const CURRICULA = [
  {
    courseTitle: 'Detecting Red Flags & Behavioral Indicators',
    modules: [
      { title: 'Understanding Behavioral Red Flags', titleAr: 'مفهوم الإشارات التحذيرية السلوكية', lessons: [
        { en: 'Definition of Red Flags', ar: 'تعريف الإشارات التحذيرية' },
        { en: 'Importance of Early Detection', ar: 'أهمية الكشف المبكر' },
        { en: 'Common Behavioral Indicators', ar: 'المؤشرات السلوكية الشائعة' }
      ]},
      { title: 'Responding to Warning Signs', titleAr: 'التعامل مع علامات الإنذار', lessons: [
        { en: 'Factors That Increase Risk', ar: 'العوامل التي تزيد المخاطر' },
        { en: 'Improving Detection Practices', ar: 'تحسين ممارسات الكشف' }
      ]}
    ]
  },
  {
    courseTitle: 'Certified Compliance Officer (CCOE)',
    modules: [
      { title: 'Role of the Compliance Officer', titleAr: 'دور مسؤول الامتثال', lessons: [
        { en: 'Definition of the Compliance Function', ar: 'تعريف وظيفة الامتثال' },
        { en: 'Importance of a Dedicated Compliance Role', ar: 'أهمية وجود دور امتثال مخصص' },
        { en: 'Core Elements of Compliance Programs', ar: 'العناصر الأساسية لبرامج الامتثال' }
      ]},
      { title: 'Strengthening Compliance Practice', titleAr: 'تعزيز ممارسة الامتثال', lessons: [
        { en: 'Factors Affecting Compliance Effectiveness', ar: 'العوامل المؤثرة في فعالية الامتثال' },
        { en: 'Improving Compliance Monitoring', ar: 'تحسين مراقبة الامتثال' }
      ]}
    ]
  },
  {
    courseTitle: 'Anti-Bribery Compliance Frameworks (ISO 37001)',
    modules: [
      { title: 'Understanding ISO 37001', titleAr: 'مفهوم معيار ISO 37001', lessons: [
        { en: 'Definition of Anti-Bribery Management Systems', ar: 'تعريف أنظمة إدارة مكافحة الرشوة' },
        { en: 'Importance of ISO 37001 Certification', ar: 'أهمية شهادة ISO 37001' },
        { en: 'Elements of the Standard', ar: 'عناصر المعيار' }
      ]},
      { title: 'Implementing the Framework', titleAr: 'تطبيق الإطار', lessons: [
        { en: 'Factors Affecting Implementation Success', ar: 'العوامل المؤثرة في نجاح التطبيق' },
        { en: 'Improving Anti-Bribery Controls', ar: 'تحسين ضوابط مكافحة الرشوة' }
      ]}
    ]
  },
  {
    courseTitle: 'Advanced AML Investigations',
    modules: [
      { title: 'Foundations of AML Investigations', titleAr: 'أساسيات تحقيقات مكافحة غسل الأموال', lessons: [
        { en: 'Definition of an AML Investigation', ar: 'تعريف تحقيق مكافحة غسل الأموال' },
        { en: 'Importance of Advanced Investigation Skills', ar: 'أهمية مهارات التحقيق المتقدمة' },
        { en: 'Key Elements of a Case File', ar: 'العناصر الأساسية لملف القضية' }
      ]},
      { title: 'Conducting Effective Investigations', titleAr: 'إجراء تحقيقات فعّالة', lessons: [
        { en: 'Factors Affecting Investigation Outcomes', ar: 'العوامل المؤثرة في نتائج التحقيق' },
        { en: 'Improving Investigation Techniques', ar: 'تحسين تقنيات التحقيق' }
      ]}
    ]
  },
  {
    courseTitle: 'PMO Setup & Maturity Models',
    modules: [
      { title: 'Understanding PMO Structures', titleAr: 'مفهوم مكاتب إدارة المشاريع', lessons: [
        { en: 'Definition of a PMO', ar: 'تعريف مكتب إدارة المشاريع' },
        { en: 'Importance of a PMO', ar: 'أهمية مكتب إدارة المشاريع' },
        { en: 'Elements of PMO Maturity Models', ar: 'عناصر نماذج نضج المكتب' }
      ]},
      { title: 'Growing PMO Capability', titleAr: 'تطوير قدرات المكتب', lessons: [
        { en: 'Factors Affecting PMO Success', ar: 'العوامل المؤثرة في نجاح المكتب' },
        { en: 'Improving PMO Maturity', ar: 'تحسين نضج المكتب' }
      ]}
    ]
  },
  {
    courseTitle: 'Accounting for Non-Financial Professionals',
    modules: [
      { title: 'Understanding Core Accounting Concepts', titleAr: 'مفهوم المحاسبة الأساسية', lessons: [
        { en: 'Definition of Key Accounting Terms', ar: 'تعريف المصطلحات المحاسبية الأساسية' },
        { en: 'Importance of Financial Literacy', ar: 'أهمية الثقافة المالية' },
        { en: 'Elements of Financial Statements', ar: 'عناصر القوائم المالية' }
      ]},
      { title: 'Applying Accounting Knowledge', titleAr: 'تطبيق المعرفة المحاسبية', lessons: [
        { en: 'Factors Affecting Financial Decisions', ar: 'العوامل المؤثرة في القرارات المالية' },
        { en: 'Improving Financial Communication', ar: 'تحسين التواصل المالي' }
      ]}
    ]
  },
  {
    courseTitle: 'Talent Attraction & Employer Branding',
    modules: [
      { title: 'Understanding Employer Branding', titleAr: 'مفهوم العلامة الوظيفية', lessons: [
        { en: 'Definition of Employer Branding', ar: 'تعريف العلامة الوظيفية' },
        { en: 'Importance of Talent Attraction', ar: 'أهمية جذب المواهب' },
        { en: 'Elements of a Strong Employer Brand', ar: 'عناصر علامة وظيفية قوية' }
      ]},
      { title: 'Building an Attraction Strategy', titleAr: 'بناء استراتيجية الجذب', lessons: [
        { en: 'Factors Affecting Candidate Decisions', ar: 'العوامل المؤثرة في قرار المرشح' },
        { en: 'Improving Talent Attraction Efforts', ar: 'تحسين جهود جذب المواهب' }
      ]}
    ]
  },
  {
    courseTitle: 'ISO 9001:2015 Lead / Internal Auditor',
    modules: [
      { title: 'Understanding ISO 9001', titleAr: 'مفهوم معيار ISO 9001', lessons: [
        { en: 'Definition of ISO 9001', ar: 'تعريف معيار ISO 9001' },
        { en: 'Importance of Quality Management Certification', ar: 'أهمية شهادة إدارة الجودة' },
        { en: 'Elements of the Standard', ar: 'عناصر المعيار' }
      ]},
      { title: 'Conducting Internal Audits', titleAr: 'إجراء التدقيق الداخلي', lessons: [
        { en: 'Factors Affecting Audit Quality', ar: 'العوامل المؤثرة في جودة التدقيق' },
        { en: 'Improving Audit Practices', ar: 'تحسين ممارسات التدقيق' }
      ]}
    ]
  },
  {
    courseTitle: 'Customer Service & Customer Experience',
    modules: [
      { title: 'Understanding Customer Experience', titleAr: 'مفهوم تجربة العميل', lessons: [
        { en: 'Definition of Customer Experience', ar: 'تعريف تجربة العميل' },
        { en: 'Importance of Customer Experience', ar: 'أهمية تجربة العميل' },
        { en: 'Elements of a Positive Experience', ar: 'عناصر التجربة الإيجابية' }
      ]},
      { title: 'Improving Service Delivery', titleAr: 'تحسين تقديم الخدمة', lessons: [
        { en: 'Factors Affecting Customer Satisfaction', ar: 'العوامل المؤثرة في رضا العملاء' },
        { en: 'Improving Customer Service Practices', ar: 'تحسين ممارسات خدمة العملاء' }
      ]}
    ]
  },
  {
    courseTitle: 'Cybersecurity Fundamentals (CC — ISC2)',
    modules: [
      { title: 'Understanding Cybersecurity Basics', titleAr: 'مفهوم أساسيات الأمن السيبراني', lessons: [
        { en: 'Definition of Cybersecurity', ar: 'تعريف الأمن السيبراني' },
        { en: 'Importance of Cybersecurity Awareness', ar: 'أهمية الوعي بالأمن السيبراني' },
        { en: 'Elements of a Security Framework', ar: 'عناصر إطار الأمن' }
      ]},
      { title: 'Strengthening Security Practices', titleAr: 'تعزيز الممارسات الأمنية', lessons: [
        { en: 'Factors Affecting Cybersecurity Risk', ar: 'العوامل المؤثرة في مخاطر الأمن السيبراني' },
        { en: 'Improving Personal Cyber Hygiene', ar: 'تحسين النظافة السيبرانية الشخصية' }
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
