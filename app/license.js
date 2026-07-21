/**
 * BodyMind OS — License Gate
 * Client-side license validation for freemium model
 */
(function() {
  'use strict';

  function initSplash() {
    const state = window.BM.state.loadState();

    // Already has a valid license — skip splash
    if (state.initialized && (state.licenseTier === 'pro' || state.licenseTier === 'studio')) {
      showApp();
      return;
    }

    // Show splash for license entry or free continuation
    const splash = document.getElementById('splash');
    const activateBtn = document.getElementById('btn-activate');
    const freeBtn = document.getElementById('btn-free-tier');
    const errorMsg = document.getElementById('splash-error');
    const upgradeInfo = document.getElementById('splash-upgrade-info');

    upgradeInfo.classList.remove('hidden');

    activateBtn.addEventListener('click', async () => {
      const key = document.getElementById('license-key').value.trim();

      if (!key) {
        showError('Please enter your license key.');
        return;
      }

      // Call the REAL ECDSA verifier
      const result = await window.License.activateLicense(key);
      if (!result.ok) {
        showError(result.reason || 'Invalid license key.');
        return;
      }

      // Success — the activateLicense function updates state automatically
      showApp();
    });

    freeBtn.addEventListener('click', () => {
      const state = window.BM.state.loadState();
      state.licenseTier = 'free';
      state.initialized = true;
      window.BM.state.saveState(state);
      showApp();
    });

    function showError(msg) {
      errorMsg.textContent = msg;
      errorMsg.classList.remove('hidden');
    }
  }

  function showApp() {
    const splash = document.getElementById('splash');
    const app = document.getElementById('app');
    splash.style.display = 'none';
    app.classList.add('visible');
    updateTierBadge();
  }

  function updateTierBadge() {
    const state = window.BM.state.loadState();
    const badge = document.getElementById('tier-badge');

    if (state.licenseTier === 'pro') {
      badge.textContent = 'Pro';
      badge.className = 'tier-badge tier-pro';
    } else if (state.licenseTier === 'studio') {
      badge.textContent = 'Studio';
      badge.className = 'tier-badge tier-pro';
    } else {
      badge.textContent = 'Starter';
      badge.className = 'tier-badge tier-free';
    }
  }

  // Expose
  window.BM = window.BM || {};
  window.BM.license = {
    initSplash,
    showApp,
    updateTierBadge
  };
})();


// ── ECDSA License Verification (REAL — wired to splash on 2026-07-20) ──
(function() {
  'use strict';
  const PRODUCT_SLUG = 'bodymind-os';
  // Supported prefixes and their mapping to tiers
  const PREFIX_TIERS = {
    'BODYMINDOS-PRO': 'pro',
    'BODYMINDOS-STUDIO': 'studio',
  };
  // Generated 2026-07-16: replaced lost private key. Pair stored at keys/license-*.pem
  const PUBLIC_KEY_JWK = {"kty":"EC","x":"brt3SKBWmzqFvjQb6b-S7k1zhuTYarEeA0UfSeJCuTs","y":"yjnRpA_CbP7Yf8pfCLgxACoXc0HOJcwDQg8y11c49V8","crv":"P-256"};

  const subtle = (typeof crypto !== 'undefined' && crypto.subtle) ? crypto.subtle : null;

  function b64urlToBytes(s) {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  let cachedKey = null;
  async function getPublicKey() {
    if (!cachedKey) {
      cachedKey = await subtle.importKey('jwk', PUBLIC_KEY_JWK, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
    }
    return cachedKey;
  }

  async function verifyLicense(key) {
    try {
      if (!subtle) return { ok: false, reason: 'WebCrypto unavailable in this context.' };
      const trimmed = (key || '').trim();
      if (!trimmed) return { ok: false, reason: 'Empty key.' };
      const parts = trimmed.split('.');
      if (parts.length !== 3) {
        return { ok: false, reason: 'Invalid key format. Expected: <PREFIX>.<payload>.<signature> — paste the full key from your email.' };
      }
      const [prefix, payloadB64, sigB64] = parts;
      // Determine tier from prefix
      const tier = PREFIX_TIERS[prefix];
      if (!tier) {
        return { ok: false, reason: 'Unknown key prefix "' + prefix + '". Expected BODYMINDOS-PRO or BODYMINDOS-STUDIO.' };
      }
      if (payloadB64.length > 2048 || sigB64.length > 512) return { ok: false, reason: 'Key too long.' };
      let payload;
      try {
        payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(payloadB64)));
      } catch (e) {
        return { ok: false, reason: 'Corrupted key payload. Re-copy the full key from your email.' };
      }
      if (payload.product !== PRODUCT_SLUG) return { ok: false, reason: 'Key is for a different product.' };
      // Verify the payload tier matches the prefix
      if (payload.tier !== tier) return { ok: false, reason: 'Tier mismatch in key.' };
      const pubKey = await getPublicKey();
      const valid = await subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, pubKey, b64urlToBytes(sigB64), new TextEncoder().encode(payloadB64));
      if (!valid) return { ok: false, reason: 'Invalid signature. This key was not issued by us — contact support for a reissue.' };
      return { ok: true, meta: { pi: payload.pi, iat: payload.iat, tier: payload.tier } };
    } catch (e) {
      return { ok: false, reason: 'Verification error: ' + e.message };
    }
  }

  async function activateLicense(key) {
    const result = await verifyLicense(key);
    if (!result.ok) return result;
    // Store in both the legacy storage and the state system
    localStorage.setItem('bodymind-os_license', JSON.stringify({ key: key.trim(), valid: true, meta: result.meta }));
    // Update the app's state system so getLicenseTier() etc. work
    if (typeof window.BM !== 'undefined' && window.BM.state && window.BM.state.setLicense) {
      window.BM.state.setLicense(result.meta.tier);
    } else {
      // Fallback — store directly in localStorage for the state system
      localStorage.setItem('bodymind_license', JSON.stringify({ tier: result.meta.tier, activated: new Date().toISOString() }));
    }
    return result;
  }

  const API = { verifyLicense, activateLicense, PREFIX_TIERS };
  if (typeof window !== 'undefined') window.License = API;
  if (typeof globalThis !== 'undefined') globalThis.License = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})();
