// Sends notification/transactional emails. Two paths:
//
//   1. SendGrid HTTP API (preferred) — set SENDGRID_API_KEY. This sends
//      over a normal HTTPS request (port 443), the same kind of request
//      the app already makes constantly, so it is NOT affected by
//      platforms (like Railway) that block outbound SMTP ports
//      (25/465/587). Use this if SMTP gave "Connection timeout" errors.
//
//   2. SMTP (fallback) — set SMTP_HOST/SMTP_USER/SMTP_PASS as before.
//      Only used if SENDGRID_API_KEY is not set. Kept for hosts that
//      don't block outbound SMTP.
//
// Neither path ever throws — a broken/missing mail config only logs a
// warning and never breaks the request that triggered it.
//
// Required environment variables — SendGrid path (recommended):
//   SENDGRID_API_KEY   starts with "SG."
//   SMTP_FROM          the verified "from" address in SendGrid (e.g. info@lltc.sa)
//   NOTIFY_EMAIL       where notifications are sent (defaults to info@lltc.sa)
//
// Required environment variables — SMTP fallback path:
//   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, NOTIFY_EMAIL

const nodemailer = require('nodemailer');

const FROM = 'notifications@app.lltc.sa'; // must match the SendGrid-verified domain (app.lltc.sa) — hardcoded since the SMTP_FROM env var kept reverting in Railway's UI
const NOTIFY_TO = process.env.NOTIFY_EMAIL || 'info@lltc.sa';

async function sendViaSendGrid(to, subject, text) {
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM },
      subject,
      content: [{ type: 'text/plain', value: text }]
    })
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`SendGrid ${res.status}: ${body.slice(0, 300)}`);
  }
}

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter;
}

async function send(to, subject, text) {
  if (process.env.SENDGRID_API_KEY) {
    try {
      await sendViaSendGrid(to, subject, text);
      return;
    } catch (err) {
      console.error('[mailer] SendGrid send failed:', err.message);
      return;
    }
  }
  const t = getTransporter();
  if (!t) {
    console.warn(`[mailer] No mail provider configured — skipped email to ${to}: "${subject}"`);
    return;
  }
  try {
    await t.sendMail({ from: FROM, to, subject, text });
  } catch (err) {
    console.error('[mailer] SMTP send failed:', err.message);
  }
}

/** @param {string} subject @param {string} text */
async function notify(subject, text) {
  await send(NOTIFY_TO, subject, text);
}

/** Sends directly to a specific recipient (e.g. a password reset link). */
async function sendTo(to, subject, text) {
  await send(to, subject, text);
}

module.exports = { notify, sendTo };
