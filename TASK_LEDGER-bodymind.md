# Task Ledger: bodymind-os — Wire Real ECDSA Verifier

**Issue**: app/state.js `validateLicenseKey()` accepts any `BOMD-XXXX-XXXX-XXXX` format — grants Pro/Studio for free.
A real ECDSA P-256 verifier exists in `app/license.js` but is never called.

## Steps

### Step 1: Fix ECDSA verifier to handle both Pro and Studio tiers
The verifier in `app/license.js` (lines 96-97) hardcodes `TIER = 'pro'`. The issuing side produces both `BODYMINDOS-PRO.*` and `BODYMINDOS-STUDIO.*` keys. Remove the hardcoded TIER, derive it from the key prefix.

**VERIFY**: grep for hardcoded TIER — should be removed from verifyLicense.

### Step 2: Fix `initSplash()` to call the real verifier
Replace the `window.BM.state.validateLicenseKey(key)` call with `window.License.activateLicense(key)`.
On success, call `window.BM.state.setLicense(tier)` where `tier` comes from the verification result.

**VERIFY**: grep for `validateLicenseKey` in `license.js` — should be zero remaining calls.

### Step 3: Fix `activateLicense()` to store in the state system
Currently `activateLicense()` stores to `bodymind-os_license` which the state system never reads.
It should also call `window.BM.state.setLicense(tier)` to update the state system.
Wait — circular dependency: `license.js` loads BEFORE `state.js` in `index.html`. Let me check the load order...
Actually looking at index.html: state.js loads first (line 80), then license.js (line 81). So `window.BM.state` is available.
But wait: `activateLicense()` in the ECDSA block stores to a separate key. Let me change it to also use `window.BM.state.setLicense`.

**VERIFY**: A valid key (test-signed) should result in `loadState().licenseTier === 'pro'` (or studio).

### Step 4: Remove/deprecate `validateLicenseKey()` from state.js
Comment it out or mark it `@deprecated` so it can't be reintroduced accidentally.

**VERIFY**: grep for `validateLicenseKey` in state.js shows it's gone/deprecated.

### Step 5: Sign demo/test keys for the thank-you page
Update `thank-you.html` to show real signed keys instead of the old `BOMD-DEMO-*` format.

**VERIFY**: Signed keys should pass the real verifier.

### Step 6: Full deploy + test
Deploy to Vercel. Run a buyer drill with a test signed key.

## DONE CHECKS (run these to confirm)
1. `grep -c "validateLicenseKey" app/license.js` — should be 0
2. `grep "window.License.activateLicense" app/license.js` — should be ≥1 (the splash handler)
3. `node -e "const k=require('./scripts/sign-license-key');" 2>&1 | head -3` — signer works
4. Run a browser test: open `app/index.html`, enter a guessed key like `BOMD-AAAA-AAAA-AAAA` — should be REJECTED
5. Enter a real signed key — should be ACCEPTED
