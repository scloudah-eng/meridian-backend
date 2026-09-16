#!/bin/bash
# Run this from inside the meridian-backend folder with: bash install-fixdemo.sh
cat > prisma/seed-fix-demo-category.js << 'FIXEOF'
// The original demo seed (seed.js) created one course — "Project
// Management Professional Prep" — with a generic placeholder category
// of "Business" instead of a real catalog axis. This recategorizes it
// to the real axis it actually belongs to (Project, Program & Portfolio
// Management), so it stops showing as an orphaned "Business" tile on
// the homepage.
//
// Run with: npm run seed:fixdemo

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORY_AR = 'إدارة المشاريع والبرامج والمحافظ';
const CATEGORY_EN = 'Project, Program & Portfolio Management';

async function main() {
  const course = await prisma.course.findFirst({
    where: { title: 'Project Management Professional Prep' }
  });

  if (!course) {
    console.log('Demo course not found (may already be recategorized or removed). No changes made.');
    return;
  }

  await prisma.course.update({
    where: { id: course.id },
    data: { category: CATEGORY_AR, categoryEn: CATEGORY_EN }
  });

  console.log(`Done. Recategorized "${course.title}" from "Business" to "${CATEGORY_EN}" / "${CATEGORY_AR}".`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
FIXEOF
echo "Done — seed-fix-demo-category.js has been created in prisma/"
ls -la prisma/seed-fix-demo-category.js
