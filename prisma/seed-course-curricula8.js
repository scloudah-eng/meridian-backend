// The catalog has two courses with the identical title "Certified
// Anti-Fraud Specialist (ACAMS – CAFS)" — one under the Fraud
// Prevention axis, one under the AML axis. This script finds the one
// specifically in the AML axis (by category) and appends "(AML)" to
// its title so it's addressable on its own, then gives it its own
// real curriculum.
//
// Run with: npm run seed:curricula8

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LESSON_DURATION = 600;
const AML_CATEGORY_AR = 'مكافحة غسل الأموال والجرائم المالية';
const DUPLICATE_TITLE = 'Certified Anti-Fraud Specialist (ACAMS – CAFS)';

const MODULES = [
  { title: 'Foundations of the CAFS Discipline (AML Context)', titleAr: 'أساسيات تخصص CAFS (في سياق مكافحة غسل الأموال)', lessons: [
    { en: 'Definition of the Anti-Fraud Specialist Role in AML', ar: 'تعريف دور أخصائي مكافحة الاحتيال في سياق مكافحة غسل الأموال' },
    { en: 'Importance of the CAFS Credential for AML Teams', ar: 'أهمية شهادة CAFS لفرق مكافحة غسل الأموال' },
    { en: 'Core Elements of the ACAMS Body of Knowledge', ar: 'العناصر الأساسية لمحتوى معرفة ACAMS' },
    { en: 'Overlap Between Fraud & Money Laundering Typologies', ar: 'التداخل بين أنماط الاحتيال وغسل الأموال' }
  ]},
  { title: 'Applying CAFS Skills to AML Casework', titleAr: 'تطبيق مهارات CAFS في قضايا مكافحة غسل الأموال', lessons: [
    { en: 'Factors Affecting Detection in AML Cases', ar: 'العوامل المؤثرة في الكشف ضمن قضايا مكافحة غسل الأموال' },
    { en: 'Techniques for Fraud-Informed AML Investigations', ar: 'تقنيات تحقيقات مكافحة غسل الأموال المستندة لخبرة الاحتيال' }
  ]},
  { title: 'Professional Practice', titleAr: 'الممارسة المهنية', lessons: [
    { en: 'Measuring Specialist Performance in AML Teams', ar: 'قياس أداء الأخصائي ضمن فرق مكافحة غسل الأموال' },
    { en: 'Improving Coordination with Fraud Teams', ar: 'تحسين التنسيق مع فرق مكافحة الاحتيال' }
  ]}
];

async function main() {
  const course = await prisma.course.findFirst({
    where: { title: DUPLICATE_TITLE, category: AML_CATEGORY_AR }
  });

  if (!course) {
    console.log('AML-axis copy not found (it may already be renamed, or both rows share the same category). No changes made.');
    return;
  }

  const newTitle = `${DUPLICATE_TITLE} — AML`;
  const newTitleAr = 'أخصائي معتمد في مكافحة الاحتيال (ACAMS – CAFS) — مكافحة غسل الأموال';

  await prisma.course.update({
    where: { id: course.id },
    data: { title: newTitle, titleAr: newTitleAr }
  });
  console.log(`Renamed course ${course.id} to: "${newTitle}"`);

  await prisma.module.deleteMany({ where: { courseId: course.id } });

  let modulesCreated = 0, lessonsCreated = 0;
  for (let mi = 0; mi < MODULES.length; mi++) {
    const mod = MODULES[mi];
    const createdModule = await prisma.module.create({
      data: { title: mod.title, titleAr: mod.titleAr, order: mi, courseId: course.id }
    });
    modulesCreated++;
    for (let li = 0; li < mod.lessons.length; li++) {
      const lesson = mod.lessons[li];
      await prisma.lesson.create({
        data: { title: lesson.en, titleAr: lesson.ar, durationSeconds: LESSON_DURATION, order: li, moduleId: createdModule.id }
      });
      lessonsCreated++;
    }
  }

  console.log(`Done. Created ${modulesCreated} modules and ${lessonsCreated} lessons for the disambiguated AML course.`);
  console.log('All 81 courses now have real curricula.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
