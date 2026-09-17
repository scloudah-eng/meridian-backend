const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');
const mailer = require('../lib/mailer');

const router = express.Router();

const traineeSchema = z.object({
  name: z.string().min(2),
  nationalId: z.string().regex(/^\d{10}$/, 'Must be a 10-digit national ID / iqama number'),
  phone: z.string().optional()
});
const bulkSchema = z.object({
  courseId: z.string(),
  trainees: z.array(traineeSchema).min(1).max(200)
});

// POST /api/institution/bulk-enroll   (INSTITUTION only)
// For each trainee: find their account by national ID, or create one
// (as a normal TRAINEE, with a temporary password returned once so the
// institution can distribute it), then enroll them in the given course
// sponsored by this institution — no individual payment required, since
// the institution is the paying party (handled outside the platform,
// e.g. via an invoice or bank transfer, same as corporate packages).
router.post('/bulk-enroll', authenticate, requireRole('INSTITUTION'), async (req, res) => {
  const parsed = bulkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const course = await prisma.course.findUnique({ where: { id: parsed.data.courseId } });
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const results = [];
  for (const t of parsed.data.trainees) {
    let user = await prisma.user.findUnique({ where: { nationalId: t.nationalId } });
    let temporaryPassword = null;

    if (!user) {
      temporaryPassword = crypto.randomBytes(6).toString('base64url');
      const passwordHash = await bcrypt.hash(temporaryPassword, 12);
      user = await prisma.user.create({
        data: { name: t.name, nationalId: t.nationalId, phone: t.phone || undefined, passwordHash, role: 'TRAINEE' }
      });
    } else if (user.role !== 'TRAINEE') {
      results.push({ nationalId: t.nationalId, name: t.name, status: 'skipped', reason: 'Existing account is not a trainee account' });
      continue;
    }

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
      update: { sponsorId: req.user.sub },
      create: { userId: user.id, courseId: course.id, sponsorId: req.user.sub }
    });

    results.push({
      nationalId: t.nationalId, name: user.name, status: 'enrolled',
      newAccount: !!temporaryPassword, temporaryPassword: temporaryPassword || undefined,
      enrollmentId: enrollment.id
    });
  }

  const institution = await prisma.user.findUnique({ where: { id: req.user.sub }, select: { name: true } });
  mailer.notify(
    `Institution bulk enrollment: ${course.title}`,
    `Institution: ${institution ? institution.name : req.user.sub}\nCourse: ${course.title}\nTrainees processed: ${results.length}\n\n${results.map(r => `- ${r.name} (${r.nationalId}): ${r.status}${r.newAccount ? ' [new account]' : ''}`).join('\n')}`
  );

  res.status(201).json({ results });
});

// GET /api/institution/roster   (INSTITUTION only) — every enrollment this institution sponsored
router.get('/roster', authenticate, requireRole('INSTITUTION'), async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { sponsorId: req.user.sub },
    include: {
      user: { select: { id: true, name: true, nationalId: true, phone: true } },
      course: { select: { id: true, title: true, titleAr: true } },
      progress: true
    },
    orderBy: { enrolledAt: 'desc' }
  });

  const roster = enrollments.map(e => {
    const total = e.progress.length;
    const completed = e.progress.filter(p => p.completed).length;
    return {
      enrollmentId: e.id,
      trainee: e.user,
      course: e.course,
      enrolledAt: e.enrolledAt,
      lessonsCompleted: completed,
      lessonsStarted: total
    };
  });

  res.json({ roster });
});

module.exports = router;
