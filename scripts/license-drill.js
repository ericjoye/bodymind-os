#!/usr/bin/env node
// license-drill.js — end-to-end fulfillment truth gate for bodymind-os.
'use strict';
const { execFileSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const windowProxy = new Proxy({}, {
  get(target, prop) {
    if (prop === 'window' || prop === 'globalThis') return windowProxy;
    if (prop in target) return target[prop];
    target[prop] = {};
    return target[prop];
  }
});
global.window = windowProxy;
global.atob = (s) => Buffer.from(s, 'base64').toString('binary');
class TextDecoderShim { decode(bytes) { return Buffer.from(bytes).toString('utf8'); } }
class TextEncoderShim { encode(str) { return new Uint8Array(Buffer.from(str, 'utf8')); } }
global.TextDecoder = global.TextDecoder || TextDecoderShim;
global.TextEncoder = global.TextEncoder || TextEncoderShim;

const licensePath = path.join(ROOT, 'app/license.js');


async function main() {
  let mod;
  try {
    mod = require(licensePath);
  } catch (e) {
    try {
      mod = await import('file://' + licensePath);
    } catch (importErr) {
      throw e;
    }
  }
  const license = (mod && mod.verifyLicense) ? mod : (global.License || windowProxy.License || mod);

  const results = [];
  const check = (name, pass, detail) => {
    results.push({ name, pass, detail });
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
  };

  const out = execFileSync('node', [path.join(__dirname, 'sign-license-key.js'), 'pi_DRILL_' + Date.now(), 'TEST DRILL'], { encoding: 'utf8' });
  const key = (out.match(/BODYMINDOS\-PRO\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/) || [])[0];
  check('signer issues a key', Boolean(key), key ? key.slice(0, 40) + '…' : 'no key in signer output');
  if (!key) return finish(results);

  const good = await license.verifyLicense(key);
  check('issued key verifies', good.ok === true, JSON.stringify(good));

  const parts = key.split('.');
  const bad1 = await license.verifyLicense([parts[0], parts[1].slice(0, -2) + 'xx', parts[2]].join('.'));
  check('tampered payload rejects', bad1.ok === false, bad1.reason);

  const bad2 = await license.verifyLicense([parts[0], parts[1], parts[2].slice(0, -2) + 'xx'].join('.'));
  check('tampered signature rejects', bad2.ok === false, bad2.reason);

  const bad3 = await license.verifyLicense('GARBAGE-DEAD-BEEF');
  check('garbage format rejects', bad3.ok === false, bad3.reason);

  check('meta carries payment id tail', good.ok && typeof good.meta.pi === 'string' && good.meta.pi.length === 8, good.ok ? good.meta.pi : 'n/a');

  finish(results);
}

function finish(results) {
  const failed = results.filter((r) => !r.pass);
  console.log('');
  console.log(failed.length === 0
    ? `DRILL PASSED (${results.length}/${results.length}) — fulfillment chain is real.`
    : `DRILL FAILED — ${failed.length} gate(s) down. NOT sellable.`);
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((e) => { console.error('DRILL ERROR:', e.message); process.exit(1); });
