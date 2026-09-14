// Replaces the single "Overview / Program introduction" placeholder
// module with a real, structured curriculum for a representative batch
// of 10 courses (one per axis) — following the pattern the client asked
// for: each course broken into modules, each module broken into
// definition / importance / elements-measures / influencing factors /
// improvement lessons. This is real curriculum content (titles/outline),
// not video — video still needs to be recorded and uploaded via admin.html.
//
// Run with: npm run seed:curricula

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LESSON_DURATION = 600; // 10 min placeholder per lesson, matches existing convention

const CURRICULA = [
  {
    courseTitle: 'Internal Fraud Prevention Strategies',
    modules: [
      { title: 'Understanding Internal Fraud', titleAr: 'مفهوم الاحتيال الداخلي', lessons: [
        { en: 'Definition of Internal Fraud', ar: 'تعريف الاحتيال الداخلي' },
        { en: 'Importance of Fraud Prevention', ar: 'أهمية الوقاية من الاحتيال' },
        { en: 'Fraud Risk Indicators & Factors', ar: 'مؤشرات وعوامل خطر الاحتيال' }
      ]},
      { title: 'Building a Prevention Program', titleAr: 'بناء برنامج الوقاية', lessons: [
        { en: 'Elements of an Anti-Fraud Program', ar: 'عناصر برنامج مكافحة الاحتيال' },
        { en: 'Improving Internal Controls', ar: 'طرق تحسين الضوابط الداخلية' },
        { en: 'Measuring Program Effectiveness', ar: 'قياس فعالية برنامج الوقاية' }
      ]}
    ]
  },
  {
    courseTitle: 'Enterprise Risk Management (ERM) Fundamentals',
    modules: [
      { title: 'Understanding ERM', titleAr: 'مفهوم إدارة المخاطر المؤسسية', lessons: [
        { en: 'Definition of ERM', ar: 'تعريف إدارة المخاطر المؤسسية' },
        { en: 'Importance of ERM for Organizations', ar: 'أهمية إدارة المخاطر للمؤسسات' },
        { en: 'Elements of a Risk Framework', ar: 'عناصر إطار إدارة المخاطر' }
      ]},
      { title: 'Applying ERM', titleAr: 'تطبيق إدارة المخاطر', lessons: [
        { en: 'Factors Affecting Risk Assessment', ar: 'العوامل المؤثرة في تقييم المخاطر' },
        { en: 'Improving Risk Culture', ar: 'تحسين ثقافة إدارة المخاطر' }
      ]}
    ]
  },
  {
    courseTitle: 'Integrity & Ethics in the Public and Private Sectors',
    modules: [
      { title: 'Understanding Institutional Integrity', titleAr: 'مفهوم النزاهة المؤسسية', lessons: [
        { en: 'Definition of Integrity & Ethics', ar: 'تعريف النزاهة والأخلاقيات' },
        { en: 'Importance of Integrity', ar: 'أهمية النزاهة في العمل المؤسسي' },
        { en: 'Elements of an Integrity Culture', ar: 'عناصر ثقافة النزاهة' }
      ]},
      { title: 'Strengthening Ethical Behavior', titleAr: 'تعزيز السلوك الأخلاقي', lessons: [
        { en: 'Factors Influencing Ethical Behavior', ar: 'العوامل المؤثرة في السلوك الأخلاقي' },
        { en: 'Improving Institutional Integrity', ar: 'طرق تحسين النزاهة المؤسسية' }
      ]}
    ]
  },
  {
    courseTitle: 'AML Fundamentals (ACAMS)',
    modules: [
      { title: 'Understanding Money Laundering', titleAr: 'مفهوم غسل الأموال', lessons: [
        { en: 'Definition & Stages of Money Laundering', ar: 'تعريف غسل الأموال ومراحله' },
        { en: 'Importance of AML', ar: 'أهمية مكافحة غسل الأموال' },
        { en: 'Suspicious Activity Indicators', ar: 'مؤشرات الأنشطة المشبوهة' }
      ]},
      { title: 'Building an AML Compliance Program', titleAr: 'بناء برنامج الامتثال', lessons: [
        { en: 'Elements of an Effective AML Program', ar: 'عناصر برنامج الامتثال الفعّال' },
        { en: 'Improving Due Diligence Procedures', ar: 'تحسين إجراءات العناية الواجبة' }
      ]}
    ]
  },
  {
    courseTitle: 'Agile Project Management (Scrum – SAFe)',
    modules: [
      { title: 'Understanding Agile Management', titleAr: 'مفهوم الإدارة الرشيقة', lessons: [
        { en: 'Definition of Scrum & SAFe', ar: 'تعريف Scrum وSAFe' },
        { en: 'Importance of Agility in Project Management', ar: 'أهمية المرونة في إدارة المشاريع' },
        { en: 'Elements of the Scrum Framework', ar: 'عناصر إطار Scrum' }
      ]},
      { title: 'Applying Scrum in Practice', titleAr: 'تطبيق Scrum عمليًا', lessons: [
        { en: 'Factors Affecting Agile Team Success', ar: 'العوامل المؤثرة في نجاح الفرق الرشيقة' },
        { en: 'Improving Agile Team Performance', ar: 'تحسين أداء الفريق الرشيق' }
      ]}
    ]
  },
  {
    courseTitle: 'Budgeting & Cost Management',
    modules: [
      { title: 'Understanding Budgeting', titleAr: 'مفهوم إعداد الميزانية', lessons: [
        { en: 'Definition & Types of Budgets', ar: 'تعريف الميزانية وأنواعها' },
        { en: 'Importance of Budgeting', ar: 'أهمية إعداد الميزانية للمؤسسات' },
        { en: 'Elements of an Effective Budget', ar: 'عناصر ميزانية فعّالة' }
      ]},
      { title: 'Managing Costs', titleAr: 'إدارة التكاليف', lessons: [
        { en: 'Factors Affecting Costs', ar: 'العوامل المؤثرة في التكاليف' },
        { en: 'Improving Cost Efficiency', ar: 'طرق تحسين كفاءة التكاليف' }
      ]}
    ]
  },
  {
    courseTitle: 'Performance Management Systems',
    modules: [
      { title: 'Understanding Performance Management', titleAr: 'مفهوم إدارة الأداء', lessons: [
        { en: 'Definition of Performance Management', ar: 'تعريف إدارة الأداء المؤسسي' },
        { en: 'Importance of Performance Management', ar: 'أهمية إدارة الأداء' },
        { en: 'Performance Measures & Indicators', ar: 'مقاييس ومؤشرات الأداء' }
      ]},
      { title: 'Improving Organizational Performance', titleAr: 'تحسين الأداء المؤسسي', lessons: [
        { en: 'Factors Affecting Performance', ar: 'العوامل المؤثرة في الأداء' },
        { en: 'Improving the Performance System', ar: 'طرق تطوير نظام تقييم الأداء' }
      ]}
    ]
  },
  {
    courseTitle: 'Total Quality Management (TQM) Foundations',
    modules: [
      { title: 'Understanding TQM', titleAr: 'مفهوم إدارة الجودة الشاملة', lessons: [
        { en: 'Definition of TQM', ar: 'تعريف إدارة الجودة الشاملة' },
        { en: 'Importance of TQM for Organizations', ar: 'أهمية الجودة الشاملة للمؤسسات' },
        { en: 'Elements of a Quality System', ar: 'عناصر نظام إدارة الجودة' }
      ]},
      { title: 'Applying a Quality Culture', titleAr: 'تطبيق ثقافة الجودة', lessons: [
        { en: 'Factors Affecting Quality Performance', ar: 'العوامل المؤثرة في جودة الأداء' },
        { en: 'Continuous Quality Improvement Methods', ar: 'طرق تحسين الجودة المستمر' }
      ]}
    ]
  },
  {
    courseTitle: 'Operations Management Fundamentals',
    modules: [
      { title: 'Understanding Operations Management', titleAr: 'مفهوم إدارة العمليات', lessons: [
        { en: 'Definition of Operations Management', ar: 'تعريف إدارة العمليات' },
        { en: 'Importance of Operations Management', ar: 'أهمية إدارة العمليات للمؤسسات' },
        { en: 'Operations Efficiency Measures', ar: 'مقاييس كفاءة العمليات' }
      ]},
      { title: 'Improving Operational Processes', titleAr: 'تحسين العمليات التشغيلية', lessons: [
        { en: 'Factors Affecting Process Efficiency', ar: 'العوامل المؤثرة في كفاءة العمليات' },
        { en: 'Methods for Improving Processes', ar: 'طرق تحسين وتطوير العمليات' }
      ]}
    ]
  },
  {
    courseTitle: 'IT Governance for Non-Specialists',
    modules: [
      { title: 'Understanding IT Governance', titleAr: 'مفهوم حوكمة تقنية المعلومات', lessons: [
        { en: 'Definition of IT Governance', ar: 'تعريف حوكمة تقنية المعلومات' },
        { en: 'Importance of Governance for Non-Specialists', ar: 'أهمية الحوكمة لغير المختصين' },
        { en: 'Elements of an IT Governance Framework', ar: 'عناصر إطار حوكمة تقنية المعلومات' }
      ]},
      { title: 'Applying Effective Governance', titleAr: 'تطبيق الحوكمة الفعّالة', lessons: [
        { en: 'Factors Affecting Governance Success', ar: 'العوامل المؤثرة في نجاح الحوكمة' },
        { en: 'Improving IT Governance', ar: 'طرق تحسين حوكمة تقنية المعلومات' }
      ]}
    ]
  }
];

async function main() {
  let coursesUpdated = 0, coursesNotFound = 0, modulesCreated = 0, lessonsCreated = 0;

  for (const entry of CURRICULA) {
    const course = await prisma.course.findFirst({ where: { title: entry.courseTitle } });
    if (!course) { console.log(`Not found, skipped: ${entry.courseTitle}`); coursesNotFound++; continue; }

    // Remove the existing placeholder module(s) for this course so the
    // real curriculum replaces it cleanly instead of sitting alongside it.
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
  console.log('Reminder: these are curriculum outlines, not video. Real video still needs to be recorded and uploaded per lesson via admin.html.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
