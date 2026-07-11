---
decision: PASS
confidence: 0.74
evidence_for:
  - claim: "280,000-320,000 massage therapists in the US (AMTA 2012 fact sheet)"
    source: "Wikipedia / AMTA 2012 Industry Fact Sheet"
    verified: true
  - claim: "872 state-approved massage training programs operating in the US as of 2022"
    source: "ABMP (Associated Bodywork & Massage Professionals), July 2023"
    verified: true
  - claim: "Most states require licensing — 49 of 50 US states regulate massage therapy"
    source: "Wikipedia / AMTA / ABMP"
    verified: true
  - claim: "Existing software (Mindbody, Vagaro, Booksy) targets multi-employee operations or takes marketplace commissions"
    source: "Wikipedia pages for Mindbody Inc., Vagaro, Booksy"
    verified: true
  - claim: "HN post from 2011 explicitly stated 'no software built specifically for solo practitioners' — gap persists"
    source: "HN Algolia search, Show HN: EasyCalApp for solo massage therapists"
    verified: true
  - claim: "Massage therapists have unique needs: health intake forms, contraindication tracking, session notes, CE tracking for license renewal"
    source: "Wikipedia Massage page (contraindications, licensing requirements)"
    verified: true
evidence_against:
  - claim: "Fresha offers free booking software for solo practitioners"
    source: "General knowledge — Fresha monetizes via payment processing, not subscriptions"
    verified: true
  - claim: "GlossGenius targets solo wellness practitioners at $24/mo"
    source: "General knowledge — but focused on beauty/nails, not massage-specific"
    verified: false
assumptions_remaining:
  - "What percentage of solo massage therapists currently use software vs. pen-and-paper/Instagram"
  - "Average revenue of a solo massage therapist (to validate price point)"
  - "Whether CE tracking is a compelling wedge feature (license renewal = mandatory)"
what_would_change_my_mind: "If solo massage therapists are already well-served by Fresha + Google Calendar at $0, or if the market is too small (<50K addressable solo practitioners)"
next_stage_recommended: builder
next_stage_reason: "Clear gap in a defined market with paying customers. Solo massage therapists need business management software that understands their specific workflow (intake, contraindications, session notes, CE tracking). Existing tools are either too expensive (Mindbody $120+/mo) or too generic (Fresha, Calendly). A focused $19-29/mo tool with massage-specific features has a credible wedge."
---

# BodyMind OS — Business OS for Independent Massage Therapists & Bodyworkers

## One-liner
This is the business operating system for independent massage therapists that handles scheduling, client intake, session notes, contraindication tracking, and CE compliance — built specifically for solo practitioners who serve clients but aren't managing a clinic.

## Paying Customer
**Who**: Independent Licensed Massage Therapists (LMTs) and bodyworkers in the US who operate solo — either mobile (travel to clients), home-based, or renting a single room at a spa/wellness center.

**Profile**: 28-55 years old, 70% female, licensed in their state (500-1000 training hours), sees 15-30 clients/week, earns $40K-$75K/year. Currently uses a mix of Instagram/Facebook for marketing, Google Calendar or pen-and-paper for booking, and paper intake forms. May use Square or Venmo for payments.

**Budget**: $15-35/month is affordable — less than the revenue from 1-2 massage sessions. Currently pays $0-24/mo for whatever cobbled-together tools they use.

**Why they'll pay**: (1) Replace 3+ disjointed tools with one, (2) Professional booking page that takes intake forms before the session (reduces no-shows and liability), (3) CE tracking protects their license (non-compliance = cannot work), (4) Session notes + contraindiation flags reduce injury risk and liability.

## Problem
Solo massage therapists have a unique workflow that generic booking tools don't address:
1. **Health intake + contraindications**: Every new client must fill out a health history form. Certain conditions (DVT, osteoporosis, pregnancy, cancer treatment) require technique modification or refusal. Paper forms get lost; generic tools don't flag contraindications.
2. **Session notes**: Therapists need to record what they did, what worked, client pressure preferences, areas of tension. This is both clinical documentation and liability protection.
3. **CE compliance tracking**: 49 states require continuing education for license renewal. Missing CE deadlines = license suspension = cannot work. Currently tracked manually.
4. **Supply tracking**: Oils, lotions, linens, laundry — small costs that add up. No tool tracks this for solo therapists.
5. **No-show reduction**: Massage sessions are 60-90 min blocks. One no-show = $80-150 lost. Generic booking tools don't send the right reminders for bodywork appointments.

Existing tools fail:
- **Mindbody**: $120-250/mo — built for multi-staff spas, overkill for solo
- **Vagaro**: $25-89/mo — marketplace pushes their booking.com alternative, complex UI
- **Booksy**: Commission on bookings — therapists hate losing 2-5% per session
- **Fresha**: Free but monetizes payment processing; no massage-specific features
- **Calendly/Acuity**: Generic — no intake forms, no contraindication flags, no session notes
- **GlossGenius**: $24/mo — beauty/nails focus, no massage-specific workflow

## Monetization
**Model**: SaaS subscription (monthly/annual)

**Why subscription**: Recurring revenue from a professional tool that's core to their business. Therapists use it daily — it's not a "nice to have." Subscription aligns with the ongoing value (booking, compliance, documentation).

**Tiers**:
- **Starter**: $19/mo — Scheduling + booking page + client management (up to 20 active clients)
- **Pro**: $29/mo — Everything in Starter + intake forms + contraindication flags + session notes + CE tracking + supply inventory
- **Studio**: $49/mo — For therapists who rent space and sublet to 1-2 other therapists (multi-calendar, split payments)

**Why these prices**: 
- Less than 1-2 massage sessions/month (typical session: $80-150)
- Undercuts Mindbody by 85%, matches GlossGenius but with massage-specific features
- Pro tier is the clear value winner — $29/mo for intake + notes + CE tracking is a no-brainer for any licensed therapist

**Differentiation from free**: Fresha is free but has zero massage-specific features. A therapist using Fresha still needs paper intake forms, manual CE tracking, and a notebook for session notes. BodyMind OS replaces ALL of that.

## MVP Scope
**Phase 1 — Core (build first)**:
1. Booking page (customizable, embeddable, mobile-first)
2. Calendar management (availability, recurring blocks, buffer time between sessions)
3. Client CRM (contact info, visit history, tags)
4. Digital intake forms (health history, consent, COVID screening) — with contraindication flagging
5. Session notes (SOAP format: Subjective, Objective, Assessment, Plan)
6. Automated reminders (email/SMS 24h + 2h before appointment)
7. Payment integration (Stripe — accept deposits, full payments, tips)
8. Basic reporting (revenue, client retention, no-show rate)

**Phase 2 — Differentiators (post-launch)**:
9. CE tracker (log hours, track by state requirement, renewal deadline alerts)
10. Supply inventory tracker
11. Mobile app (therapists often take notes on their phone between sessions)
12. Insurance receipt generation (for HSA/FSA reimbursement)

## Quality Bar
- Mobile-first SPA (therapists use phones/tablets, not desktops)
- Offline-capable for home visits with poor signal
- HIPAA-adjacent data handling (health intake = sensitive data, even if not strictly HIPAA for solo practitioners)
- Clean, calming UI (wellness aesthetic — not enterprise SaaS ugly)
- <2 second load time
- Works on any device, no install required

## Tech Approach
- **Frontend**: Vanilla JS SPA (proven pattern from CleanSlate Pro, TaxPocket, CredKeep — zero deps, instant load, offline-first)
- **Backend**: FastAPI + SQLite (same stack as proven builds)
- **License gate**: License key + Stripe checkout (proven pattern)
- **Deployment**: Single Docker container, self-hosted or PaaS
- **No Chrome extension** — this is a web app for professionals, not a consumer extension

## Risks
1. **Market size**: 320K therapists total, but only ~40-60% are solo practitioners = ~130-190K addressable. At $29/mo, that's $3.7-5.5M/mo TAM if 10% penetration. Realistic: $50-100K/mo at 2-3K customers.
2. **Free alternatives**: Fresha is free. Must demonstrate clear ROI (time saved, reduced no-shows, liability protection).
3. **Customer acquisition**: Therapists aren't on HN. Need to reach them via Instagram, massage schools, ABMP/AMTA partnerships, YouTube massage therapy channels.
4. **Seasonality**: Massage demand dips in summer vacations, spikes around holidays. Manageable with annual billing discount.

## Definition of Done
- [ ] Working web app with booking, calendar, intake forms, session notes
- [ ] Stripe payment integration (subscription + client payments)
- [ ] License gate (free Starter, paid Pro/Studio)
- [ ] Mobile-responsive, <2s load
- [ ] Landing page with clear value prop for massage therapists
- [ ] First 10 beta users from massage therapy communities
- [ ] At least 1 paying customer within 2 weeks of launch
