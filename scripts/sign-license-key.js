#!/usr/bin/env node
// sign-license-key.js — issue a bodymind-os license key.
//
// Usage: node scripts/sign-license-key.js <stripe-payment-intent-id> [note]
//
// Signs with keys/license-private.pem (ECDSA P-256). The app verifies with
// the embedded public key — offline, unforgeable. Every issuance is
// appended to keys/issued.json.

'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const PRIVATE_KEY_PATH = path.join(ROOT, 'keys', 'license-private.pem');
const ISSUED_LOG = path.join(ROOT, 'keys', 'issued.json');

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function main() {
  const [pi, note] = process.argv.slice(2);
  if (!pi) {
    console.error('Usage: node sign-license-key.js <stripe-payment-intent-id> [note]');
    process.exit(1);
  }

  const privateKey = crypto.createPrivateKey(fs.readFileSync(PRIVATE_KEY_PATH));
  const payload = {
    product: 'bodymind-os',
    tier: 'pro',
    pi: pi.slice(-8),
    iat: new Date().toISOString().slice(0, 10),
    nonce: crypto.randomBytes(4).toString('hex'),
  };

  const payloadB64 = b64url(JSON.stringify(payload));
  const signature = crypto.sign('sha256', Buffer.from(payloadB64, 'ascii'), {
    key: privateKey,
    dsaEncoding: 'ieee-p1363',
  });
  const key = `BODYMINDOS-PRO.${payloadB64}.${b64url(signature)}`;

  let log = [];
  try { log = JSON.parse(fs.readFileSync(ISSUED_LOG, 'utf8')); } catch (e) {}
  if (!Array.isArray(log)) log = [];
  log.push({ issuedAt: new Date().toISOString(), paymentIntent: pi, note: note || null, key });
  fs.writeFileSync(ISSUED_LOG, JSON.stringify(log, null, 2) + '\n');

  console.log('License key (send the WHOLE line, it is case-sensitive):');
  console.log('');
  console.log(`  ${key}`);
}

main();
