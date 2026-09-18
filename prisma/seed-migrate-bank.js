// The platform used to store one bank account directly on
// PlatformSettings (bankName/bankAccountName/bankIban/bankSwift). Those
// columns were dropped in favor of a proper BankAccount table that
// supports multiple accounts. This script copies whatever was already
// entered there into the first BankAccount row, labeled "Mada Alhyat
// Training Center", so nothing already filled in is lost.
//
// Safe to run more than once — it does nothing if a Mada Alhyat account
// already exists.
//
// Run with: npm run seed:migrate-bank

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// These are the values that were on record before the schema change —
// hardcoded here since the old columns no longer exist to read from.
const OLD_BANK = {
  bankName: 'الأول ساب',
  accountName: 'مركز مدى الحياة للتدريب',
  iban: 'SA2345000000352625834001',
  swift: 'SABBSARI'
};

async function main() {
  const existing = await prisma.bankAccount.findFirst({ where: { label: 'Mada Alhyat Training Center' } });
  if (existing) {
    console.log('Mada Alhyat bank account already exists — nothing to migrate.');
    return;
  }

  await prisma.bankAccount.create({
    data: {
      label: 'Mada Alhyat Training Center',
      labelAr: 'مركز مدى الحياة للتدريب',
      bankName: OLD_BANK.bankName,
      accountName: OLD_BANK.accountName,
      iban: OLD_BANK.iban,
      swift: OLD_BANK.swift,
      order: 0
    }
  });

  console.log('Done. Migrated the Mada Alhyat bank account into the new BankAccount table.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
