const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

function slugify(title) {
  return title.toLowerCase().trim()
    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

// GET /api/blog/posts?category=   (public — published posts only)
router.get('/posts', async (req, res) => {
  const { category } = req.query;
  const posts = await prisma.blogPost.findMany({
    where: { published: true, ...(category ? { category: String(category) } : {}) },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' }
  });
  res.json({ posts });
});

// GET /api/blog/posts/:slug   (public — must be published)
router.get('/posts/:slug', async (req, res) => {
  const post = await prisma.blogPost.findUnique({
    where: { slug: req.params.slug },
    include: { author: { select: { name: true } } }
  });
  if (!post || !post.published) return res.status(404).json({ error: 'Post not found' });
  res.json({ post });
});

// GET /api/blog/mine   (author's own posts, published or not)
router.get('/mine', authenticate, requireRole('ADMIN', 'TRAINER', 'CONSULTANT'), async (req, res) => {
  const posts = await prisma.blogPost.findMany({
    where: req.user.role === 'ADMIN' ? {} : { authorId: req.user.sub },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ posts });
});

const postSchema = z.object({
  title: z.string().min(3),
  titleAr: z.string().optional(),
  excerpt: z.string().min(5),
  excerptAr: z.string().optional(),
  body: z.string().min(20),
  bodyAr: z.string().optional(),
  category: z.string().min(2),
  coverImageUrl: z.string().url().optional(),
  published: z.boolean().optional()
});

// POST /api/blog/posts   (admin, trainer, or consultant — becomes the author)
router.post('/posts', authenticate, requireRole('ADMIN', 'TRAINER', 'CONSULTANT'), async (req, res) => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  let slug = slugify(parsed.data.title) || `post-${Date.now()}`;
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const post = await prisma.blogPost.create({
    data: {
      ...parsed.data,
      slug,
      authorId: req.user.sub,
      publishedAt: parsed.data.published ? new Date() : null
    }
  });
  res.status(201).json({ post });
});

// PATCH /api/blog/posts/:id   (owning author, or admin)
router.patch('/posts/:id', authenticate, requireRole('ADMIN', 'TRAINER', 'CONSULTANT'), async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (req.user.role !== 'ADMIN' && post.authorId !== req.user.sub) {
    return res.status(403).json({ error: 'You can only edit your own posts' });
  }
  const parsed = postSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const data = { ...parsed.data };
  if (parsed.data.published && !post.publishedAt) data.publishedAt = new Date();

  const updated = await prisma.blogPost.update({ where: { id: req.params.id }, data });
  res.json({ post: updated });
});

// DELETE /api/blog/posts/:id   (owning author, or admin)
router.delete('/posts/:id', authenticate, requireRole('ADMIN', 'TRAINER', 'CONSULTANT'), async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (req.user.role !== 'ADMIN' && post.authorId !== req.user.sub) {
    return res.status(403).json({ error: 'You can only delete your own posts' });
  }
  await prisma.blogPost.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

module.exports = router;
