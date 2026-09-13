// Minimal client for the Daily.co REST API (https://docs.daily.co/reference/rest-api).
//
// Daily.co is used here because it needs only a single API key — no OAuth
// app review, no per-platform SDK approval — which makes it a practical
// default for a self-hosted training platform's live classes. Sign up
// free at https://dashboard.daily.co, create an API key under
// Developers, and set DAILY_API_KEY in .env (see README "Live video
// sessions").
//
// Swapping providers later means replacing just this file: e.g. to use
// Zoom instead, create a meeting via Zoom's Server-to-Server OAuth API
// here and return { name, url } the same shape as below — nothing in
// live.routes.js needs to change.

const DAILY_API_URL = process.env.DAILY_API_URL || 'https://api.daily.co/v1';

async function createRoom({ name, expiresAt }) {
  if (!process.env.DAILY_API_KEY) {
    throw new Error('DAILY_API_KEY is not set — see README "Live video sessions"');
  }
  const res = await fetch(`${DAILY_API_URL}/rooms`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      properties: {
        exp: expiresAt ? Math.floor(new Date(expiresAt).getTime() / 1000) : undefined,
        enable_chat: true
      }
    })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Daily.co room creation failed: ${res.status} ${body}`);
  }
  return res.json(); // { name, url, ... }
}

async function deleteRoom(name) {
  if (!process.env.DAILY_API_KEY) return;
  await fetch(`${DAILY_API_URL}/rooms/${name}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` }
  }).catch(() => {});
}

module.exports = { createRoom, deleteRoom };
