// Sends a plain-text notification email to the company inbox whenever a
// contact message, consulting request, business solution request, or
// course enrollment comes in. Requires real SMTP credentials set as
// environment variables — without them, this logs a warning and does
// nothing (it never throws, so a missing/broken mail config never
// breaks the actual request that triggered it).
//
// Required environment variables (set these on Railway):
//   SMTP_HOST       e.g. smtp.gmail.com, smtp.office365.com, smtp.sendgrid.net
//   SMTP_PORT       e.g. 587 (TLS) or 465 (SSL)
//   SMTP_SECURE     "true" for port 465, "false" for 587/other (default: false)
//   SMTP_USER       the mailbox / API username to authenticate as
//   SMTP_PASS       the mailbox password or API key
//   SMTP_FROM       the "from" address shown on the email (defaults to SMTP_USER)
//   NOTIFY_EMAIL    where notifications are sent (defaults to info@lltc.sa)

const nodemailer = require('nodemailer');

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

/**
 * @param {string} subject
 * @param {string} text  plain-text body
 */
async function notify(subject, text) {
  const t = getTransporter();
  if (!t) {
    console.warn(`[mailer] SMTP not configured — skipped notification: "${subject}"`);
    return;
  }
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL || 'info@lltc.sa',
      subject,
      text
    });
  } catch (err) {
    // Never let a mail failure break the request that triggered it.
    console.error('[mailer] Failed to send notification:', err.message);
  }
}

/**
 * Sends directly to a specific recipient — used when the email needs to
 * reach an actual user (e.g. a password reset link), not the company's
 * shared inbox. Same silent-no-SMTP / never-throw behavior as notify().
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 */
async function sendTo(to, subject, text) {
  const t = getTransporter();
  if (!t) {
    console.warn(`[mailer] SMTP not configured — skipped email to ${to}: "${subject}"`);
    return;
  }
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text
    });
  } catch (err) {
    console.error('[mailer] Failed to send email to', to, ':', err.message);
  }
}

module.exports = { notify, sendTo };
