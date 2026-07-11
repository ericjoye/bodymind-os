/**
 * Sign License — Generate a signed license key (admin/manual use)
 *
 * POST /api/sign-license
 * Body: { paymentIntent: string, tier?: 'pro'|'studio', note?: string }
 *
 * Returns: { key: string, tier: string, issuedAt: string }
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function loadPrivateKey() {
  const pemContent = process.env.BODYMINDOS_PRIVATE_KEY
    || (() => {
        const p = path.resolve(__dirname, '..', 'keys', 'license-private.pem');
        return fs.readFileSync(p, 'utf8');
      })();
  return crypto.createPrivateKey(pemContent);
}

function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentIntent, tier = 'pro', note } = req.body || {};
  if (!paymentIntent) {
    return res.status(400).json({ error: 'paymentIntent is required' });
  }

  try {
    const privateKey = loadPrivateKey();
    const payload = {
      product: 'bodymind-os',
      tier: tier,
      pi: String(paymentIntent).slice(-8),
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

    return res.json({
      key,
      tier,
      issuedAt: new Date().toISOString(),
      paymentIntent: String(paymentIntent).slice(-8),
      note: note || null,
    });
  } catch (err) {
    console.error('Signing error:', err.message);
    return res.status(500).json({ error: 'Signing failed: ' + err.message });
  }
};
