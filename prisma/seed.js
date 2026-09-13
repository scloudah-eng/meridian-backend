// Populates the database with a demo admin account, a demo trainer account,
// and one sample course so you can log in and test the API immediately
// after running migrations. Run with: npm run seed

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);

  const admin = await prisma.user.upsert({
    where: { nationalId: '1000000001' },
    update: {},
    create: {
      nationalId: '1000000001',
      name: 'System Admin',
      passwordHash,
      role: 'ADMIN'
    }
  });

  const trainer = await prisma.user.upsert({
    where: { nationalId: '1000000002' },
    update: {},
    create: {
      nationalId: '1000000002',
      name: 'Hassan Al-Ghamdi',
      passwordHash,
      role: 'TRAINER'
    }
  });

  await prisma.user.upsert({
    where: { nationalId: '1000000003' },
    update: {},
    create: {
      nationalId: '1000000003',
      name: 'Sara Al-Otaibi',
      passwordHash,
      role: 'TRAINEE'
    }
  });

  const existing = await prisma.course.findFirst({ where: { title: 'Project Management Professional Prep' } });
  if (!existing) {
    await prisma.course.create({
      data: {
        title: 'Project Management Professional Prep',
        titleAr: 'التحضير لشهادة إدارة المشاريع الاحترافية (PMP)',
        category: 'Business',
        description: 'A structured walkthrough of the PMBOK process groups and knowledge areas, built around real project scenarios.',
        price: 349,
        instructorId: trainer.id,
        modules: {
          create: [
            {
              title: 'Foundations of project management',
              titleAr: 'أساسيات إدارة المشاريع',
              order: 1,
              lessons: {
                create: [
                  { title: 'What a project manager actually owns', titleAr: 'ما الذي يتولاه مدير المشروع فعليًا', order: 1, durationSeconds: 720 },
                  { title: 'Process groups and knowledge areas', titleAr: 'مجموعات العمليات ومجالات المعرفة', order: 2, durationSeconds: 1080 }
                ]
              }
            },
            {
              title: 'Planning and scheduling',
              titleAr: 'التخطيط والجدولة',
              order: 2,
              lessons: {
                create: [
                  { title: 'Building a work breakdown structure', titleAr: 'بناء هيكل تجزئة العمل', order: 1, durationSeconds: 1320 }
                ]
              }
            }
          ]
        }
      }
    });
  }

  console.log('Seed complete.');
  console.log('  Admin login:   nationalId=1000000001  password=ChangeMe123!');
  console.log('  Trainer login: nationalId=1000000002  password=ChangeMe123!');
  console.log('  Trainee login: nationalId=1000000003  password=ChangeMe123!');
  console.log('Change these passwords immediately in any real deployment.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
