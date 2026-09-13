const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

async function assertCourseOwnership(req, res, courseId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) { res.status(404).json({ error: 'Course not found' }); return null; }
  if (req.user.role !== 'ADMIN' && course.instructorId !== req.user.sub) {
    res.status(403).json({ error: 'You can only edit your own courses' });
    return null;
  }
  return course;
}

const moduleSchema = z.object({
  title: z.string().min(2),
  titleAr: z.string().optional(),
  order: z.number().int().min(1)
});

// POST /api/courses/:courseId/modules   (add a module/section to a course)
router.post('/courses/:courseId/modules', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const course = await assertCourseOwnership(req, res, req.params.courseId);
  if (!course) return;
  const parsed = moduleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const mod = await prisma.module.create({ data: { ...parsed.data, courseId: course.id } });
  res.status(201).json({ module: mod });
});

// PATCH /api/modules/:id
router.patch('/modules/:id', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const existing = await prisma.module.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: 'Module not found' });
  const course = await assertCourseOwnership(req, res, existing.courseId);
  if (!course) return;

  const parsed = moduleSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await prisma.module.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ module: updated });
});

// DELETE /api/modules/:id   (also deletes its lessons, via cascade)
router.delete('/modules/:id', authenticate, requireRole('TRAINER', 'ADMIN'), async (req, res) => {
  const existing = await prisma.module.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: 'Module not found' });
  const course = await assertCourseOwnership(req, res, existing.courseId);
  if (!course) return;

  await prisma.module.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

module.exports = router;
