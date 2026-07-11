/**
 * Stripe Webhook — BodyMind OS Automated License Fulfillment
 *
 * POST /api/stripe-webhook
 * Listens for checkout.session.completed events, generates an
 * ECDSA-signed license key, and returns it. The key is logged
 * to /tmp/issued-keys.json for claim-page lookup.
 *
 * Environment variables:
 *   STRIPE_WEBHOOK_SECRET — Stripe webhook signing secret (live)
 *   STRIPE_API_KEY       — Stripe secret key (sk_live_...)
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ── Stripe Integration (lazy-loaded) ──
let stripe = null;
function getStripe() {
  if (stripe) return stripe;
  const Stripe = require('stripe');
  const key = process.env.STRIPE_API_KEY;
  if (!key) throw new Error('STRIPE_API_KEY env var not set');
  stripe = new Stripe(key, { apiVersion: '2025-02-24.acacia' });
  return stripe;
}

// ── License Key Signing ──
function loadPrivateKey() {
  // Try environment variable first, then file path
  const pemContent = process.env.BODYMINDOS_PRIVATE_KEY
    || (() => {
        // Relative to api/ directory: ../../keys/license-private.pem
        const p = path.resolve(__dirname, '..', 'keys', 'license-private.pem');
        return fs.readFileSync(p, 'utf8');
      })();
  return crypto.createPrivateKey(pemContent);
}

function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function signLicenseKey(paymentIntentId, tier = 'pro') {
  const privateKey = loadPrivateKey();
  const payload = {
    product: 'bodymind-os',
    tier: tier,
    pi: String(paymentIntentId).slice(-8),
    iat: new Date().toISOString().slice(0, 10),
    nonce: crypto.randomBytes(4).toString('hex'),
  };

  const payloadB64 = b64url(Buffer.from(JSON.stringify(payload)));
  const signature = crypto.sign('sha256', Buffer.from(payloadB64, 'ascii'), {
    key: privateKey,
    dsaEncoding: 'ieee-p1363',
  });

  const prefix = tier === 'studio' ? 'BODYMINDOS-STUDIO' : 'BODYMINDOS-PRO';
  const key = `${prefix}.${payloadB64}.${b64url(signature)}`;

  // Log to /tmp for claim-page lookup
  logIssuance(key, paymentIntentId, tier);

  return key;
}

function logIssuance(key, paymentIntentId, tier) {
  const logPath = '/tmp/bodymind-os-issued.json';
  let log = [];
  try {
    const raw = fs.readFileSync(logPath, 'utf8');
    log = JSON.parse(raw);
  } catch (e) {
    /* first entry */
  }
  if (!Array.isArray(log)) log = [];

  log.push({
    issuedAt: new Date().toISOString(),
    paymentIntentId: String(paymentIntentId),
    tier: tier,
    key: key,
  });

  // Keep last 500 entries
  if (log.length > 500) log = log.slice(-500);

  try {
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  } catch (e) {
    console.error('Failed to log issuance:', e.message);
  }
}

// ── HTTP Handler ──
module.exports = async (req, res) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ error: 'STRIPE_WEBHOOK_SECRET not configured' });
  }

  let event;
  try {
    const sig = req.headers['stripe-signature'];
    event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Only handle successful checkouts
  if (event.type !== 'checkout.session.completed') {
    return res.json({ received: true, event: event.type });
  }

  const session = event.data.object;
  const paymentIntentId = session.payment_intent || session.id;
  const mode = session.mode; // 'subscription' or 'payment'

  // Determine tier from metadata or amount
  let tier = 'pro';
  if (session.metadata && session.metadata.tier) {
    tier = session.metadata.tier;
  } else {
    // Studio ($49) vs Pro ($29) — Studio has price $49
    const amount = session.amount_total || (session.amount_subtotal || 0);
    if (amount >= 4900) tier = 'studio'; // $49+
  }

  // Generate the license key
  let licenseKey;
  try {
    licenseKey = signLicenseKey(paymentIntentId, tier);
    console.log(`License issued: ${paymentIntentId} → ${tier}`);
  } catch (err) {
    console.error('License signing failed:', err.message);
    return res.status(500).json({ error: 'License generation failed' });
  }

  // Return success — Stripe expects 200
  return res.json({
    received: true,
    event: event.type,
    license_issued: true,
    tier: tier,
    payment_intent: String(paymentIntentId).slice(-8),
  });
};
