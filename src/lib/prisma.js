const { PrismaClient } = require('@prisma/client');

// A single shared Prisma client instance, reused across the app so we
// don't open a new database connection pool per request.
const prisma = new PrismaClient();

module.exports = prisma;
