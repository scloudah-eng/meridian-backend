// One-time password reset for every user EXCEPT admins — sets the
// password for all TRAINER, TRAINEE, CONSULTANT, MARKETER, and
// INSTITUTION accounts to a single shared value. Does NOT delete or
// otherwise modify any account, course, enrollment, or other data —
// password only.
//
// Run with: node prisma/reset-nonadmin-passwords.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const NEW_PASSWORD = 'Mada@12345678';

async function main() {
  const passwordHash = await bcrypt.hash(NEW_PASSWORD, 12);

  const result = await prisma.user.updateMany({
    where: { role: { not: 'ADMIN' } },
    data: { passwordHash }
  });

  console.log(`Done. Updated password for ${result.count} non-admin users (TRAINER, TRAINEE, CONSULTANT, MARKETER, INSTITUTION).`);
  console.log(`New password for all of them: ${NEW_PASSWORD}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
