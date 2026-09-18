require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/courses.routes');
const moduleRoutes = require('./routes/modules.routes');
const lessonRoutes = require('./routes/lessons.routes');
const enrollmentRoutes = require('./routes/enrollments.routes');
const certificateRoutes = require('./routes/certificates.routes');
const paymentRoutes = require('./routes/payments.routes');
const adminRoutes = require('./routes/admin.routes');
const settingsRoutes = require('./routes/settings.routes');
const liveRoutes = require('./routes/live.routes');
const subscriptionRoutes = require('./routes/subscriptions.routes');
const applicationRoutes = require('./routes/applications.routes');
const consultingRoutes = require('./routes/consulting.routes');
const corporateRoutes = require('./routes/corporate.routes');
const blogRoutes = require('./routes/blog.routes');
const businessSolutionsRoutes = require('./routes/businessSolutions.routes');
const contactRoutes = require('./routes/contact.routes');
const materialsRoutes = require('./routes/materials.routes');
const trainersRoutes = require('./routes/trainers.routes');
const marketersRoutes = require('./routes/marketers.routes');
const institutionRoutes = require('./routes/institution.routes');
const adminAccountsRoutes = require('./routes/admin-accounts.routes');
const bankAccountsRoutes = require('./routes/bank-accounts.routes');
const combinedInquiryRoutes = require('./routes/combined-inquiry.routes');

const app = express();
app.set('trust proxy', 1); // Railway sits behind one reverse proxy — needed for express-rate-limit to read X-Forwarded-For correctly

app.use(helmet({ crossOriginResourcePolicy: false })); // allow serving /uploads to the frontend's origin
const corsOrigins = (process.env.CORS_ORIGIN || '*').split(',').map(o => o.trim());
app.use(cors({ origin: corsOrigins.includes('*') ? '*' : corsOrigins }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Serves uploaded lesson videos, e.g. GET /uploads/videos/<file>.mp4
// (see src/routes/lessons.routes.js for the storage caveats).
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', moduleRoutes);   // exposes /api/courses/:courseId/modules and /api/modules/:id
app.use('/api', lessonRoutes);   // exposes /api/modules/:moduleId/lessons and /api/lessons/:id(/video)
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api', liveRoutes); // exposes /api/courses/:courseId/live-sessions and /api/live-sessions/*
app.use('/api', subscriptionRoutes); // exposes /api/subscription-plans and /api/subscriptions(/mine)
app.use('/api/applications', applicationRoutes);
app.use('/api/consulting', consultingRoutes); // exposes /api/consulting/services and /api/consulting/requests
app.use('/api/corporate-packages', corporateRoutes); // exposes /api/corporate-packages and /api/corporate-packages/inquiries
app.use('/api/blog', blogRoutes); // exposes /api/blog/posts and /api/blog/mine
app.use('/api/business-solutions', businessSolutionsRoutes); // exposes /api/business-solutions and /api/business-solutions/requests
app.use('/api/contact', contactRoutes);
app.use('/api/course-materials', materialsRoutes);
app.use('/api/trainers', trainersRoutes);
app.use('/api/marketers', marketersRoutes);
app.use('/api/institution', institutionRoutes);
app.use('/api/admin-accounts', adminAccountsRoutes);
app.use('/api/bank-accounts', bankAccountsRoutes);
app.use('/api/combined-inquiry', combinedInquiryRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Centralized error handler — keeps stack traces out of API responses.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message && err.message.includes('video') ? err.message : 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Mada Alhyat API listening on port ${port}`));
