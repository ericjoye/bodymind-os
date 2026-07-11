/**
 * Claim Key — Retrieve a license key after Stripe payment
 *
 * GET /api/claim-key?session_id=cs_xxx&email=user@example.com
 * Looks up the issued license key by payment intent ID and returns it.
 *
 * Response: { found: bool, key?: string, tier?: string }
 */
'use strict';

const fs = require('fs');

module.exports = async (req, res) => {
  const { session_id, payment_intent, email } = req.query || {};

  if (!session_id && !payment_intent && !email) {
    return res.status(400).json({
      found: false,
      error: 'Provide session_id, payment_intent, or email parameter',
    });
  }

  const logPath = '/tmp/bodymind-os-issued.json';
  let entries = [];
  try {
    const raw = fs.readFileSync(logPath, 'utf8');
    entries = JSON.parse(raw);
  } catch (e) {
    return res.json({ found: false, error: 'No license records found' });
  }

  if (!Array.isArray(entries)) {
    return res.json({ found: false, error: 'Corrupted records' });
  }

  // Search by session_id or payment_intent
  const match = entries.find(e =>
    (session_id && e.paymentIntentId === session_id) ||
    (payment_intent && e.paymentIntentId === payment_intent)
  );

  if (!match) {
    return res.json({
      found: false,
      error: 'No license found for that identifier. It may not have propagated yet (allow ~30 seconds after payment).',
    });
  }

  return res.json({
    found: true,
    key: match.key,
    tier: match.tier,
    issuedAt: match.issuedAt,
  });
};
