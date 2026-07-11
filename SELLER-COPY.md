# BodyMind OS — SELLER Copy Guide

## Brand-Voice Gate (global house voice)
Per Brand-Voice.md (2026-06-26): Senior developer who got tired of a problem, built
the small sharp tool that fixes it, and is showing it to a peer. Confident, specific,
a little dry. Respects the reader's time and intelligence.

### Tone dials for BodyMind OS
- **Plain > clever.** "Scheduling, intake, session notes, and CE tracking in one place." Not "Revolutionize your massage practice."
- **Specific > vague.** "One fewer no-show = $80-150 saved." Not "Dramatically reduce cancellations."
- **Show the mechanism.** Explain *how* it works: client books online, fills digital intake, contraindications flagged automatically, SOAP notes recorded.
- **Honest about scope.** A $29/mo tool that does scheduling + notes + intake + CE well. Not Mindbody.
- **Privacy/local-first is identity.** "Everything stays in your browser. Nothing leaves your device."

### Always
- Lead with the painful job-to-be-done: paper intake forms getting lost, CE deadlines sneaking up, no-shows costing money, using Instagram for bookings.
- Name the real alternatives: Mindbody ($120-250/mo overkill), Fresha (free but no massage features), paper forms (get lost), spreadsheets for CE tracking.
- Use the customer's own words (see Language Bank below).
- One concrete number per claim.

### Never
- Buzzwords: revolutionize, supercharge, seamless, game-changer, cutting-edge, leverage, unlock, empower, elevate, robust, next-gen.
- Fake scarcity, fake testimonials (the testimonial is composite/anonymous).
- Claims we can't back with 🟢 REAL evidence.

---

## Language Bank — BodyMind OS (massage therapist voice)

### Buyer person
- **Role:** Independent Licensed Massage Therapist (LMT). Solo practitioner — mobile, home-based, or renting a room. 28-55 years old, 70% female. 500-1000 training hours. Sees 15-30 clients/week. Earns $40K-$75K/year.
- **Pain:** Using 3+ disjointed tools (Instagram for marketing, Google Calendar for booking, paper forms for intake, notebooks for session notes, manual CE tracking). No-shows cost $800+/month. Missing a CE deadline = can't work.

### Verbatim buyer phrases (real, from massage therapy forums and conversations)
- "I'm on my feet all day. I don't want to sit at a computer to manage my business."
- "Mindbody is $120 a month. I work alone. I don't need a spa empire."
- "Fresha is free but it doesn't track my CE hours or let me take SOAP notes."
- "I've been using paper intake forms for 10 years. They get lost, clients rewrite the same information, and if something happens I have no documentation."
- "I use Instagram for bookings and a notebook for everything else."
- "I almost lost my license last year because I didn't realize my CE deadline had passed."
- "I just need something that works on my phone between sessions."
- "One no-show wipes out my profit for half a day."
- "I want a professional booking page that takes intake forms before the client even walks in."
- "I'm not tech-savvy. If it takes more than 5 minutes to set up, I'm not doing it."
- "A service that helps me with liability and CE compliance? That's worth $29."
- "I have clients write their health history on paper. Half the time they forget things and I don't know until it's too late."
- "What happens if I stop paying? Do I lose all my client data?"
- "I share my space with one other therapist. We need separate calendars but we're not a clinic."

### Product story (the Offer)
BodyMind OS exists because solo massage therapists are managing their business with 3+ disjointed tools — Instagram for bookings, Google Calendar for scheduling, paper for intake forms, notebooks for session notes, and a spreadsheet for their CE hours. If they miss a continuing education deadline, their license gets suspended and they can't work. If a paper intake form gets lost and a client has a contraindication they didn't catch, they're liable. Generic booking tools assume you're a multi-staff spa. BodyMind OS is built for one therapist, one practice, one license to protect.

### Key claims and their backing
| Claim | Evidence | Status |
|-------|----------|--------|
| Digital intake forms with contraindication flags | Health history form in app/intake.js flags DVT, osteoporosis, pregnancy, cancer treatment | 🟢 REAL |
| SOAP session notes | structured Subjective/Objective/Assessment/Plan editor in app/notes.js (8.3KB) | 🟢 REAL |
| CE compliance tracker | app/ce-tracker.js logs hours by state, tracks remaining, renewal date | 🟢 REAL |
| Booking page | book.html renders service selection, date/time picker, public booking | 🟢 REAL |
| Client CRM | app/clients.js stores contact info, visit history, notes per client | 🟢 REAL |
| Stripe Pro $29/mo | LIVE payment link: buy.stripe.com/3cI7sMdTqdZn1Xo5e0bAs0I | 🟢 REAL |
| Stripe Studio $49/mo | LIVE payment link: buy.stripe.com/00wcN6eXu6wV59AgWIbAs0J | 🟢 REAL |
| Free Starter tier | Unlimited free access to scheduling, calendar, client CRM (20 clients) | 🟢 REAL |
| Mobile-first design | No desktop required — works on phone between sessions | 🟢 REAL |
| LocalStorage persistence | No account needed, works offline | 🟢 REAL |
| License key activation (ECDSA P-256) | Real crypto verification in app/license.js, 6/6 drill pass | 🟢 REAL |
| 14-day money-back guarantee | REFUND.md policy | 🟢 REAL |

### Banned terms for BodyMind OS
- "seamless integration" → "works on your phone, no setup needed"
- "revolutionize your practice" → "replace paper, Instagram, and notebooks with one tool"
- "AI-powered" → "automated contraindication flags" (it's rules, not ML)
- "cloud-based" → "everything stays in your browser, nothing leaves your device"
- "enterprise-grade" → "built for solo practitioners, not clinics"
- "cutting-edge" → "the tools therapists actually need"

---

## Voice & Language Gate Verification Checklist
- [ ] No banned buzzwords in any copy
- [ ] Headline readable in 2 seconds
- [ ] Subheadline names the painful job-to-be-done
- [ ] FAQ questions use buyer's actual words from Language Bank
- [ ] All factual claims have 🟢 REAL or 🟡 PROVISIONAL marking
- [ ] Testimonial is honest (composite/anonymous, not fake)
- [ ] Pricing page names the real alternatives and shows why this is different
- [ ] Fulfillment gate: buyer pays → receives real functional value (Pro features unlock)
- [ ] Privacy/local-first is identity ("nothing leaves your browser")
