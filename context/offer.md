# Offer — BodyMind OS

## The promise
BodyMind OS is the business operating system for independent massage therapists. It handles scheduling, client intake, session notes, contraindication tracking, and CE compliance — built specifically for solo practitioners who serve clients but aren't managing a clinic.

## Who the buyer is
Independent Licensed Massage Therapists (LMTs) and bodyworkers in the US who operate solo — mobile, home-based, or renting a single room. 28-55 years old, sees 15-30 clients/week, earns $40K-$75K/year. Currently cobbling together Instagram + Google Calendar + paper forms.

## What they feel
- Frustrated by cobbling together Instagram + Google Calendar + paper forms
- Anxious about missing CE deadlines and losing their license
- Worried about liability — what if a client has a condition they didn't disclose?
- Professional pride — they're a healthcare provider, not just a "service worker"
- Overwhelmed by enterprise software built for spas with 10+ staff

## What the buyer gets

### Starter ($0/mo)
- Booking page (clients can book 24/7)
- Calendar management
- Client CRM (up to 20 active clients)
- Revenue dashboard
- Automated reminders (UI only — no sending mechanism in MVP)

### Pro ($29/mo)
Everything in Starter plus:
- Digital intake forms with contraindication flagging
- SOAP session notes (Subjective, Objective, Assessment, Plan)
- CE compliance tracker (log hours, track by state requirement, renewal alerts)
- Supply inventory tracker
- Unlimited clients

### Studio ($49/mo)
Everything in Pro plus:
- Multi-calendar (for therapists who sublet space)
- Split payments between therapists
- Up to 2 sub-therapist accounts

## Fulfillment state
- License gate: BUILT (client-side, BOMD-XXXX-XXXX-XXXX format)
- Stripe integration: NOT BUILT (placeholder link on landing page)
- Automated reminders: NOT BUILT (UI exists, no sending mechanism)
- Multi-calendar (Studio): PLACEHOLDER only
- All core features (booking, CRM, intake, notes, CE): WORKING and GATED CORRECTLY

## Monetization model
SaaS subscription (monthly). Recurring revenue from a professional tool that's core to daily practice. $29/mo Pro tier is the clear value winner — less than 1-2 massage sessions/month.

## Price justification
- Pro $29/mo = $348/year
- Saves 2-3 hours/week on admin (scheduling, paperwork, CE tracking)
- Reduces no-shows (one no-show = $80-150 lost)
- Protects license (CE tracking prevents lapse = cannot work)
- Alternative: Mindbody at $120-250/mo (85% more expensive, built for multi-staff)

## Objections to preempt
1. "Fresha is free" → Fresha has zero massage-specific features. You still need paper intake, manual CE tracking, notebook for notes.
2. "I don't need software" → You're already using 4+ tools. One replaces them all and protects your license.
3. "It's too expensive" → $29/mo is less than one no-show. How many no-shows do you have per month?
4. "I'm not tech-savvy" → No install, no account needed for clients. Works in any browser.
5. "What if I stop paying?" → Your data stays in your browser. Export anytime. No lock-in.
