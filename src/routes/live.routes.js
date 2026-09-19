const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');
const daily = require('../lib/dailyco');

const router = express.Router();

async function assertCourseOwnership(req, res, courseId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) { res.status(404).json({ error: 'Course not found' }); return null; }
  if (req.user.role !== 'ADMIN' && course.instructorId !== req.user.sub) {
    res.status(403).json({ error: 'You can only schedule sessions for your own courses' });
    return null;
  }
  return course;
}

// POST /api/courses/:courseId/live-sessions   { title, scheduledAt, durationMinutes }
// For a LIVE course this creates a real Daily.co room. For an IN_PERSON
// course it just records the scheduled meetup (no video room) — attendance
// for either is then marked via POST /api/live-sessions/:id/attendance.
// The join URL is only ever returned here (to the trainer/admin who
// created it) and via /api/live-sessions/mine to enrolled trainees —
// never on the public listing below.
router.post('/courses/:courseId/live-sessions', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const course = await assertCourseOwnership(req, res, req.params.courseId);
  if (!course) return;
  const { title, scheduledAt, durationMinutes } = req.body;
  if (!title || !scheduledAt) return res.status(400).json({ error: 'title and scheduledAt are required' });

  if (course.deliveryType === 'IN_PERSON') {
    const session = await prisma.liveSession.create({
      data: {
        courseId: course.id,
        title,
        scheduledAt: new Date(scheduledAt),
        durationMinutes: durationMinutes || 60,
        provider: 'in_person',
        roomName: null,
        joinUrl: null
      }
    });
    return res.status(201).json({ session });
  }

  const roomName = `${course.id.slice(0, 8)}-${Date.now()}`;
  const expiresAt = new Date(new Date(scheduledAt).getTime() + (durationMinutes || 60) * 60000 + 3600000); // +1h buffer

  let room;
  try {
    room = await daily.createRoom({ name: roomName, expiresAt });
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }

  const session = await prisma.liveSession.create({
    data: {
      courseId: course.id,
      title,
      scheduledAt: new Date(scheduledAt),
      durationMinutes: durationMinutes || 60,
      provider: 'daily',
      roomName: room.name,
      joinUrl: room.url
    }
  });
  res.status(201).json({ session });
});

// GET /api/courses/:courseId/live-sessions   (public schedule — no join link)
router.get('/courses/:courseId/live-sessions', async (req, res) => {
  const sessions = await prisma.liveSession.findMany({
    where: { courseId: req.params.courseId },
    select: { id: true, title: true, scheduledAt: true, durationMinutes: true, provider: true },
    orderBy: { scheduledAt: 'asc' }
  });
  res.json({ sessions });
});

// GET /api/live-sessions/mine   (trainee — sessions for courses they're enrolled in, with join links)
router.get('/live-sessions/mine', authenticate, requireRole('TRAINEE'), async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({ where: { userId: req.user.sub }, select: { courseId: true } });
  const courseIds = enrollments.map((e) => e.courseId);
  const sessions = await prisma.liveSession.findMany({
    where: { courseId: { in: courseIds } },
    include: { course: { select: { title: true, titleAr: true, deliveryType: true, locationName: true, locationNameAr: true, locationAddress: true } } },
    orderBy: { scheduledAt: 'asc' }
  });
  res.json({ sessions });
});

// GET /api/live-sessions/hosting   (trainer/admin — sessions for courses they teach, with join links)
router.get('/live-sessions/hosting', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const where = req.user.role === 'ADMIN' ? {} : { course: { instructorId: req.user.sub } };
  const sessions = await prisma.liveSession.findMany({
    where,
    include: { course: { select: { title: true, deliveryType: true } } },
    orderBy: { scheduledAt: 'asc' }
  });
  res.json({ sessions });
});

// GET /api/live-sessions/:id/attendance   (trainer/admin — roster to mark)
// Returns every trainee enrolled in the course, each with their current
// attended (true/false) flag for this specific session.
router.get('/live-sessions/:id/attendance', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const session = await prisma.liveSession.findUnique({ where: { id: req.params.id } });
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const course = await assertCourseOwnership(req, res, session.courseId);
  if (!course) return;

  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: session.courseId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      sessionAttendance: { where: { sessionId: session.id } }
    }
  });
  const roster = enrollments.map(e => ({
    enrollmentId: e.id,
    trainee: e.user,
    attended: e.sessionAttendance[0] ? e.sessionAttendance[0].attended : false
  }));
  res.json({ session, roster });
});

// POST /api/live-sessions/:id/attendance   { records: [{ enrollmentId, attended }] }
// (trainer/admin) — upserts attendance for this session, one row per trainee.
router.post('/live-sessions/:id/attendance', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const session = await prisma.liveSession.findUnique({ where: { id: req.params.id } });
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const course = await assertCourseOwnership(req, res, session.courseId);
  if (!course) return;

  const records = Array.isArray(req.body.records) ? req.body.records : [];
  await Promise.all(records.map(r =>
    prisma.sessionAttendance.upsert({
      where: { sessionId_enrollmentId: { sessionId: session.id, enrollmentId: r.enrollmentId } },
      update: { attended: !!r.attended },
      create: { sessionId: session.id, enrollmentId: r.enrollmentId, attended: !!r.attended }
    })
  ));
  res.json({ ok: true });
});

// DELETE /api/live-sessions/:id
router.delete('/live-sessions/:id', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const session = await prisma.liveSession.findUnique({ where: { id: req.params.id } });
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const course = await assertCourseOwnership(req, res, session.courseId);
  if (!course) return;

  if (session.provider === 'daily' && session.roomName) {
    await daily.deleteRoom(session.roomName);
  }
  await prisma.liveSession.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

module.exports = router;
