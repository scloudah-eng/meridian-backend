# Mada Alhyat Training Center — Backend API

A real, deployable backend for the Mada Alhyat platform: PostgreSQL database,
Express REST API, JWT-based accounts with three roles (trainee, trainer,
admin), course/lesson management, enrollment and watch-time progress
tracking, certificate issuance with public verification, and a payments
flow ready to be wired to a real gateway.

This is a starting point you own and can deploy — not a hosted service.
Nothing here runs live until you deploy it yourself.

## Stack

- **Node.js + Express** — API server
- **PostgreSQL** — database
- **Prisma** — schema, migrations, type-safe queries
- **JWT (jsonwebtoken) + bcrypt** — accounts and password hashing
- **zod** — request validation

## 1. Run it locally

```bash
cp .env.example .env
# edit .env — at minimum set JWT_SECRET to a real random value

docker compose up -d db      # starts Postgres only
npm install
npm run prisma:migrate       # creates the database tables
npm run seed                 # creates a demo admin, trainer and trainee
npm run seed:scl             # creates the real SCL / Mada Alhyat course catalog (see section 2a)
npm run seed:consulting      # creates the real consulting-services catalog (see section 2b)
npm run seed:plans           # creates 4 subscription plan tiers — basic/silver/gold/platinum (see section 2c)
npm run seed:corporate       # creates 4 corporate/B2B package tiers (see section 2e)
npm run dev                  # starts the API on http://localhost:4000
```

Demo accounts created by `npm run seed` (change these passwords in any
real deployment):

| Role    | National ID | Password       |
|---------|--------------|----------------|
| Admin   | 1000000001   | ChangeMe123!   |
| Trainer | 1000000002   | ChangeMe123!   |
| Trainee | 1000000003   | ChangeMe123!   |

Or run everything (API + database) in Docker:

```bash
docker compose up --build
```

## 2. API overview

All responses are JSON. Authenticated routes expect
`Authorization: Bearer <token>`, where `<token>` comes from
`/api/auth/login` or `/api/auth/register`.

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create an account (demo password auth) |
| POST | `/api/auth/login` | public | Log in, get a token |
| GET | `/api/auth/me` | any logged-in user | Current user profile |
| GET | `/api/courses` | public | Browse the catalog (`?category=`, `?q=`) |
| GET | `/api/courses/:id` | public | Course detail with modules/lessons |
| POST | `/api/courses` | trainer, admin | Create a course |
| PATCH `/api/courses/:id` | trainer (own), admin | Edit a course |
| DELETE `/api/courses/:id` | trainer (own), admin | Delete a course |
| POST | `/api/courses/:courseId/modules` | trainer (own), admin | Add a module/section |
| PATCH \| DELETE | `/api/modules/:id` | trainer (own), admin | Edit / delete a module |
| POST | `/api/modules/:moduleId/lessons` | trainer (own), admin | Add a lesson |
| PATCH \| DELETE | `/api/lessons/:id` | trainer (own), admin | Edit / delete a lesson |
| POST | `/api/lessons/:id/video` | trainer (own), admin | Upload a video file for a lesson (`multipart/form-data`, field `video`) |
| GET | `/api/settings` | public | Platform branding (site name, description, logo, color) |
| PATCH | `/api/settings` | admin | Edit platform branding |
| POST | `/api/payments` | trainee | Start a payment (`courseId`, `method`) |
| POST | `/api/payments/:id/confirm` | trainee | Demo stand-in for a gateway webhook |
| POST | `/api/enrollments` | trainee | Enroll (after payment succeeds) |
| GET | `/api/enrollments/mine` | trainee | My courses + progress |
| POST | `/api/enrollments/:id/progress` | trainee | Report watched seconds for a lesson |
| POST | `/api/certificates/:enrollmentId/issue` | trainee | Issue a certificate (all lessons must be complete) |
| GET | `/api/certificates/verify/:refCode` | public | Verify a certificate (what a QR code should link to) |
| GET | `/api/admin/stats` | admin | Platform totals |
| GET | `/api/admin/courses` | admin | All courses with enrollment counts |
| POST | `/api/courses/:courseId/live-sessions` | trainer (own), admin | Schedule a live class (creates a real Daily.co room) |
| GET | `/api/courses/:courseId/live-sessions` | public | Upcoming sessions for a course (no join link) |
| GET | `/api/live-sessions/mine` | trainee | Sessions with join links for enrolled courses |
| GET | `/api/live-sessions/hosting` | trainer, admin | Sessions they're hosting, with join links |
| DELETE | `/api/live-sessions/:id` | trainer (own), admin | Cancel a session |

A lesson counts as complete once 80% of its duration has been reported as
watched (`enrollments.routes.js`), and a certificate can only be issued
once every lesson in the course is complete (`certificates.routes.js`) —
this is the "minimum training hours" rule from the front-end demo,
enforced for real on the server this time.

### Course management, video, and "creating online courses"

Everything needed to build a course as a trainer or admin now exists as
real API calls: create the course, add modules, add lessons to each
module, then upload a video file per lesson. An "online course" on this
platform *is* a course whose lessons have videos attached this way —
there's no separate concept to set up beyond that.

Two things worth being precise about, since the phrasing could mean
either:

- **Video upload vs. in-browser recording.** `/api/lessons/:id/video`
  accepts an already-recorded video file. It does not capture webcam or
  screen video from within a browser tab — that's a distinct frontend
  feature (using the browser's MediaRecorder API) that would still end
  by uploading its output to this same endpoint. Say if you want that
  in-browser recording UI built too.
- **Recorded vs. live online courses.** This platform is built for
  *recorded* (on-demand) courses. Live/scheduled online classes
  (like a Zoom session) are a different feature entirely — they'd need
  a video-conferencing integration (Zoom API, Daily.co, or similar) and
  a scheduling model, neither of which exists here yet.

**Video storage caveat:** lesson videos currently save to the server's
local disk (see `src/routes/lessons.routes.js`). That's enough to test
the full upload flow, but raw files served this way have no adaptive
streaming or CDN and won't hold up at real scale — swap in a video host
such as Mux, Cloudflare Stream, or Bunny Stream for production; the
README section below covers this the same way it covers payments.

### What's still not connected

This API is fully real and independently testable (with curl, Postman,
or similar) — but **no frontend is wired to it yet**. Neither the
`index.html` demo (which still uses `localStorage`) nor a dedicated
admin panel currently calls any of these endpoints. Building an actual
admin dashboard UI — course/module/lesson forms, a video upload
control, a settings page — that calls this API is the next piece of
work; it hasn't been built yet. Say the word if you'd like that built
next.

## 2a. The SCL / Mada Alhyat course catalog

`npm run seed:scl` creates the real course catalog from the company
profile: **81 courses across the 10 subject axes** (Fraud Prevention,
Risk & Compliance, Anti-Corruption, AML/CFT, Project Management,
Finance, HR, Quality Systems, Operations, and IT/Cybersecurity), each
with its bilingual title (English + the exact Arabic from the document)
and its certifying-body attribution (GAFM, ACFE, ACAMS, ISC2, PMI, IIA,
CompTIA, etc.) carried over from the PDF.

Be precise about what that script does and doesn't give you:

- **Real:** every course's title, Arabic title, axis/category, and
  description are taken from the actual document — nothing invented.
- **Placeholder, on purpose:** the PDF is a company profile, not a
  curriculum — it names each program but gives no lesson breakdown,
  durations, or prices. So every course is created with a price of
  **1 SAR** and a single "Overview" module holding one short placeholder
  lesson. Selling any of these for real means going into `admin.html`
  (logged in as the seeded trainer, national ID `1000000099`, password
  `ChangeMe123!`) and, per course: setting a real price, building out
  real modules and lessons, and uploading real video.
- **Not imported:** the document also lists "Technology Solutions" per
  axis — that's the company's third business line (software/systems
  integration, not trainable or consultable content in the same sense),
  so it's intentionally left out. Its "Consulting Services" column *is*
  now imported — see section 2b below.
- **Category is now bilingual:** courses carry both `category` (Arabic,
  the original axis name) and `categoryEn` (its English translation);
  the frontend shows whichever matches the active language.

## 2b. The consulting-services catalog

`npm run seed:consulting` creates **83 consulting services across the
same 10 axes**, taken from the same PDF's "الخدمات الاستشارية" column —
real engagement types (e.g. "Fraud Risk Assessment & Control Gap
Analysis", "PMO Design & Maturity Assessment"), each with its bilingual
title and category. This is a separate business line from courses: a
`ConsultingService` isn't taken or completed, it's a service a company
or trainee inquires about via a public `ConsultingRequest` (no login
required to submit one — see the API table above). All 83 services are
owned by a seeded consultant account:

```
Consultant login: nationalId=1000000098  password=ChangeMe123!
```

Log into `admin.html` with that account (or as admin) to see and manage
inquiries as they come in.

## 2c. Subscription plans

`npm run seed:plans` creates four tiers — **Basic, Silver, Gold,
Platinum** — granting catalog-wide course access for a period instead
of paying per course (`/api/subscription-plans`, `/api/subscriptions`).
A trainee with an active subscription can enroll in any course for free
(`enrollments.routes.js` checks this automatically). **Prices and
durations are placeholders** (no source document specified real
subscription pricing) — edit them via `PATCH /api/subscription-plans/:id`
(admin only) before selling.

## 2d. Trainer / consultant marketplace & a security fix

Trainers and consultants can no longer self-register directly.
`POST /api/auth/register` used to accept a `role` field from the request
body and trust it as-is — meaning anyone could have signed up as
`ADMIN`. **That hole is now closed**: `/register` always creates a
`TRAINEE` account, full stop.

The only way to become a `TRAINER` or `CONSULTANT` is now:
1. Anyone submits a public application — no login required — via
   `POST /api/applications` (there's a "Join as a trainer or consultant"
   link in `index.html`'s footer that opens this form).
2. An admin reviews it in `admin.html`'s **Applications** tab and
   approves or rejects it.
3. Approval creates the account and returns a one-time temporary
   password, shown once in the admin panel (email it to the applicant in
   production instead of just displaying it).

## 2e. Mega menu, corporate (B2B) packages, and the blog

Three more pieces, all real:

- **Mega menu** — the "Courses" nav item in `index.html` now opens a
  dropdown listing every real category with its live course count
  (`/api/courses`, grouped client-side), matching the browse-by-category
  pattern of marketplace-style platforms — built from your own data and
  design system, not copied from anyone else's code or content.
- **Corporate (B2B) packages** — `/api/corporate-packages` and a public
  `/api/corporate-packages/inquiries` endpoint, with 4 seeded tiers
  (`npm run seed:corporate`) sold by inquiry rather than instant
  checkout, matching how B2B training deals are actually sold. Seat
  counts and starting prices are placeholders — edit via
  `PATCH /api/corporate-packages/:id` (admin) before quoting anyone.
  Manage packages and incoming inquiries from `admin.html`'s
  **Corporate** tab (admin only); browse and inquire from `index.html`'s
  **Corporate** page (public, no login to submit an inquiry).
- **Blog** — `/api/blog/posts` (public, published posts only) and
  `/api/blog/mine` (admin/trainer/consultant). **No posts are seeded**
  — there's no source document with real blog content, so nothing was
  fabricated. Write and publish real posts from `admin.html`'s **Blog**
  tab; they'll appear on `index.html`'s **Blog** page once published.

## 2f. Free preview (marketing) videos

Every course now has an optional `previewVideoUrl` — a short marketing
clip anyone can watch on the public course-detail page **without
enrolling or paying**, distinct from the paid lesson videos behind
enrollment. Upload one per course from `admin.html`'s course editor
(the "Free preview video" block above the modules list) via
`POST /api/courses/:id/preview-video` (trainer who owns the course, or
admin), or remove it via the matching `DELETE` route. **None are
seeded** — there's no real marketing footage to attach, so every
course starts without one; the section simply stays hidden on
`index.html` until a real video is uploaded.

## 3. The admin / trainer control panel

`admin.html` (in the project root, alongside the frontend site) is a
real control panel wired to this API — not a demo. It supports:

- Logging in as a trainer or admin account (real `/api/auth/login`)
- Admin: platform stats, every course, platform branding settings
- Trainer: their own courses
- Creating, editing, and deleting courses
- Adding/removing modules and lessons within a course
- Uploading a video file per lesson
- Editing platform settings (site name, description, logo, color) — admin only

To use it: start the API (`npm run dev` or `docker compose up`), open
`admin.html` directly in a browser, confirm the "API base URL" field at
the top matches where your API is running (defaults to
`http://localhost:4000`), and log in with a trainer or admin account —
the seeded demo accounts from step 1 work out of the box.

Trainee accounts are not meant to use this panel — it's for course
creation and platform management, not for taking courses. The trainee
experience is still the separate `index.html` site, which is **not yet
wired to this API** (see the next section).

## 4. The trainee-facing frontend

`index.html` (project root, alongside `admin.html`) is now wired to this
real API — browsing, registration/login, checkout, enrollment, video
playback with real progress tracking, certificate issuance, and joining
live sessions all call the endpoints above instead of using
`localStorage` as a database. `localStorage` is still used, but only for
what it's actually appropriate for: caching the auth token, the chosen
language, and the API base URL across page loads.

To try it: start the API, open `index.html` in a browser, confirm the
"API base URL" bar at the top matches your API's address, and register
a trainee account (or log in with the seeded trainee: national ID
`1000000003`, password `ChangeMe123!`). Trainer/admin accounts are
turned away from this site's login with a message pointing to
`admin.html` instead — the two are intentionally separate apps for two
different audiences.

The homepage now also mirrors the broader-marketplace structure common
to platforms like Anardes.sa, built with real data instead of copied
content: a live stats bar (course/consulting/people counts pulled from
the API), a category browse strip with real per-category counts, a
subscription-plans section, and a trainers/consultants section derived
from actual course instructors and consulting-service owners. The new
**Consulting** nav item lists the 83 seeded consulting services with a
public inquiry form per service (no login required — see section 2b),
and the new **Subscriptions** nav item lists the 4 plan tiers (see
section 2c). Note on scope: this recreates the *functional structure*
of a marketplace-style training platform using your own real backend
and design system — it does not, and should not, copy another
platform's actual code, imagery, or written copy.

What's still simplified relative to a full production build:

- No password reset flow, email verification, or session refresh —
  the JWT simply expires after 7 days and the person logs in again.
- The catalog card and detail page only show fields the schema actually
  has (title, category, description, price, instructor, curriculum) —
  there's no ratings/reviews model yet.
- Lesson video playback uses the browser's native `<video>` element
  pointed at the uploaded file's URL; there's no adaptive-bitrate
  streaming (see the video storage note in section 2).

## 5. Deploying for real

Pick any host that runs Node.js and Postgres. Straightforward options:

- **Railway** or **Render** — connect this repo, add a Postgres add-on,
  set the environment variables from `.env.example`, deploy.
- **Fly.io** — `fly launch` picks up the `Dockerfile` directly.
- **A VPS** (e.g. DigitalOcean, AWS Lightsail) — run
  `docker compose up -d --build` on the server, put a reverse proxy
  (Caddy or nginx) in front for HTTPS.

Whichever you choose: set `JWT_SECRET` to a long random value, set
`CORS_ORIGIN` to your real frontend's domain, and run
`npm run prisma:migrate` (or `prisma migrate deploy` in production)
against the real database before going live.

## 6. Nafath integration (real identity verification)

The current `/api/auth` routes use a national ID + password you set
yourself — that's demo auth so the API works standalone. For real
Nafath login:

1. Apply for Nafath integration through the National Information Center
   — this requires a formal agreement; it isn't a public self-serve API.
2. Once approved, you get a client ID/secret and implement the standard
   OAuth 2.0 / OIDC redirect flow: send the user to Nafath, they approve
   in the Nafath app, Nafath redirects back to your `NAFATH_REDIRECT_URI`
   with a verified national ID and name.
3. Replace `POST /api/auth/register` + `/login` with a
   `GET /api/auth/nafath/callback` route that does
   `prisma.user.upsert()` on that verified national ID — no password
   is collected or stored at all in this flow.

## 7. Payments integration (real charges)

The current `/api/payments` routes create a `pending` record and a demo
`/confirm` route to mark it `succeeded` — useful for testing the rest of
the flow, but it does not move any real money.

For real charges supporting mada, Apple Pay and STC Pay for a Saudi
merchant, use a payment aggregator such as **Moyasar**, **PayTabs**, or
**HyperPay** (any of the three cover all four methods plus cards); use
**PayPal's** server-side Orders API for PayPal specifically. In each
case: create the charge from your server using the aggregator's SDK,
pass this Payment record's `id` as your reference, and have the
aggregator call a webhook route you add (e.g.
`POST /api/payments/webhook`) to flip the status to `succeeded` or
`failed` — never trust a "success" reported directly from the browser.

## 8. Live video sessions (Daily.co)

Trainers and admins can schedule a live class for a course
(`POST /api/courses/:courseId/live-sessions`), which creates a real
video-call room via the Daily.co API and stores it as a `LiveSession`.

Setup:

1. Sign up free at https://dashboard.daily.co
2. Create an API key under **Developers**
3. Set `DAILY_API_KEY` in `.env` (see `.env.example`)

Without a key, scheduling a session fails with a clear error rather
than silently doing nothing. The join link is never exposed on the
public course listing — only to the trainer/admin who created it
(immediately, in the creation response, and again via
`GET /api/live-sessions/hosting`) and to trainees enrolled in that
course (`GET /api/live-sessions/mine`). A Daily.co room URL opens a
full video-call UI directly in the browser — no SDK or embedding is
required to join.

**Using a different provider:** everything provider-specific lives in
`src/lib/dailyco.js`. To use Zoom instead, replace that file's
`createRoom`/`deleteRoom` functions with calls to Zoom's
Server-to-Server OAuth API, returning `{ name, url }` the same shape —
`live.routes.js` doesn't need to change.

## 9. Compliance notes

This backend implements the mechanics discussed earlier — identity
verification (once wired to real Nafath), attendance/watch-time
tracking, gated certificate issuance, and a verifiable certificate
endpoint. It does not by itself constitute official accreditation:
full TVTC (المؤسسة العامة للتدريب التقني والمهني) accreditation
requires their direct review of the finished, deployed platform.
