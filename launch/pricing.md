# Pricing Plan — BodyMind OS

## Monetization Model: SaaS Subscription

**Why subscription:** BodyMind OS is a professional tool that therapists use daily for booking, documentation, and compliance. Subscription aligns with ongoing value (continuous bookings, ongoing CE tracking, regular client management). Monthly billing matches how solo professionals budget for tools.

**Why not one-time:** CE tracking, booking management, and intake forms are ongoing needs — not a one-time problem. A therapist uses this every week for years.

**Why not freemium with ads:** Healthcare professionals handling sensitive data deserve zero ads, zero data monetization. The free Starter tier is the try-before-you-buy path.

## Tier Structure

### Starter — $0/mo (free forever)
**Target:** Therapists testing the tool or with a small client base
- Booking page (shareable link, client self-booking)
- Calendar management
- Client CRM (up to 20 active clients)
- Revenue dashboard
- Automated reminders (UI only — MVP gap)

**Why free:** Removes adoption barrier. Therapists try it with their first 20 clients, see value, upgrade when they need intake forms or hit client limit.

### Pro — $29/mo (or $290/year = 2 months free)
**Target:** Active solo practitioners who need intake, notes, and CE tracking
- Everything in Starter
- Digital intake forms with contraindication flagging
- SOAP session notes
- CE compliance tracker (per-state requirements)
- Supply inventory tracker
- Unlimited clients

**Why $29/mo:**
- Less than 1 massage session/month (typical session: $80-150)
- Undercuts Mindbody by 85% ($120-250/mo)
- Matches GlossGenius ($24/mo) but with massage-specific features
- At 30 clients × $80/session = $2,400/week revenue, $29/mo is 1.2% of revenue
- **Value math:** Prevents 2 no-shows/month = $160-300 saved. Tool pays for itself 5-10x over.

### Studio — $49/mo (or $490/year)
**Target:** Therapists who rent space and sublet to 1-2 other practitioners
- Everything in Pro
- Multi-calendar (separate schedule per therapist)
- Split payments between therapists
- Up to 2 sub-therapist accounts

**Why $49/mo:** Targets therapists with higher revenue (sublet income) who need multi-calendar coordination. Niche tier — most buyers will be Pro.

## Stripe Configuration

| Product | Tier | Price | Stripe Price Name |
|---------|------|-------|-------------------|
| BodyMind OS | Pro Monthly | $29/mo | bodymind-os-pro-monthly |
| BodyMind OS | Pro Annual | $290/yr | bodymind-os-pro-annual |
| BodyMind OS | Studio Monthly | $49/mo | bodymind-os-studio-monthly |
| BodyMind OS | Studio Annual | $490/yr | bodymind-os-studio-annual |

**After-payment license key message:**
"Thank you for subscribing to BodyMind OS {tier}. Your license key has been sent to your email. Enter it in Settings to unlock your plan."

**Where Eric pastes the Payment Link URL:**
- Landing page CTA buttons point to `{{STRIPE_PAYMENT_LINK_PRO}}` and `{{STRIPE_PAYMENT_LINK_STUDIO}}`
- After Stripe setup, paste the live Payment Link URL into the landing page and README

## Known Gaps (documented, not hidden)
- No Stripe integration yet (placeholder link — Eric must configure)
- No email/SMS sending for reminders (UI exists, no backend)
- No data export (planned for v1.1)
- No multi-device sync (localStorage only — one browser)
- Client-side license gate (known tradeoff, CPL-007)

## Upgrade Path
Free Starter → Pro ($29/mo): When therapist needs intake forms, hits 20-client limit, or wants CE tracking
Pro → Studio ($49/mo): When therapist starts subleting space to other practitioners
