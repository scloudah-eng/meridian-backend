// The platform switched its login identifier from national ID to
// email. Any account created before this change has no email set, and
// would be unable to log in. This script gives every such account a
// placeholder email so it stays reachable — the account holder (or an
// admin) should update it to a real address via a future "edit profile"
// feature, but this keeps nothing locked out in the meantime.
//
// The well-known seed/demo accounts get memorable addresses; everyone
// else gets a generated one based on their national ID (if they have
// one) or their user ID.
//
// Run with: npm run seed:backfill-emails

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const KNOWN_EMAILS = {
  '1000000001': 'admin@lltc.sa',
  '1000000002': 'trainer@lltc.sa',
  '1000000003': 'trainee@lltc.sa',
  '1000000098': 'consultant@lltc.sa',
  '1000000099': 'trainer2@lltc.sa'
};

async function main() {
  const users = await prisma.user.findMany({ where: { email: null } });
  let updated = 0, skipped = 0;

  for (const user of users) {
    let email = user.nationalId && KNOWN_EMAILS[user.nationalId];
    if (!email) {
      const base = user.nationalId || user.id.slice(0, 8);
      email = `user-${base}@placeholder.lltc.sa`;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) { skipped++; continue; } // extremely unlikely collision — leave it, don't guess further

    await prisma.user.update({ where: { id: user.id }, data: { email } });
    console.log(`  ${user.name} (${user.role}) -> ${email}`);
    updated++;
  }

  console.log(`Done. Backfilled ${updated} accounts (${skipped} skipped due to an email collision).`);
  console.log('Known demo accounts can now log in with the emails above and their existing password.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
