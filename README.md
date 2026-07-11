# BodyMind OS

Business operating system for independent massage therapists and bodyworkers.

## What it does

- **Booking Page** — Clients can book appointments 24/7
- **Calendar** — See your schedule, navigate months, create bookings
- **Client CRM** — Track client contact info, visit history, notes
- **Digital Intake Forms** (Pro) — Health history with automatic contraindication flagging
- **SOAP Session Notes** (Pro) — Subjective, Objective, Assessment, Plan documentation
- **CE Tracker** (Pro) — Log continuing education hours, track state requirements
- **Revenue Dashboard** — See income, retention, no-show rates

## Running

No build step. No dependencies. Just open in a browser:

```bash
# Option 1: Direct file open
open index.html                    # macOS
xdg-open index.html                # Linux

# Option 2: Simple HTTP server (recommended for service workers, etc.)
python3 -m http.server 8080
# Then open http://localhost:8080/
```

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Starter | $0/mo | Booking, calendar, CRM (20 clients), reminders |
| Pro | $29/mo | Everything + intake forms, SOAP notes, CE tracker, unlimited clients |
| Studio | $49/mo | Pro + multi-calendar for sublet spaces |

## License Key Format

Keys follow the pattern: `BOMD-XXXX-XXXX-XXXX`

Demo key for testing Pro: `BOMD-DEMO-PRO2-2026`

## Tech Stack

- Vanilla JavaScript (zero dependencies)
- localStorage persistence (offline-first)
- CSS custom properties (calming wellness aesthetic)
- ~14 files, ~2,500 lines

## File Structure

```
bodymind-os/
├── index.html          # Landing page
├── styles.css          # App styles
├── landing.css         # Landing page styles
├── README.md           # This file
├── BUILD-REPORT.md     # Build handoff
├── app/
│   ├── index.html      # App shell
│   ├── state.js        # State management + license
│   ├── license.js      # License gate
│   ├── app.js          # Main controller
│   ├── dashboard.js    # Dashboard + settings
│   ├── clients.js      # Client CRM
│   ├── calendar.js     # Calendar + booking
│   ├── intake.js       # Digital intake forms (Pro)
│   ├── notes.js        # SOAP session notes (Pro)
│   └── ce-tracker.js   # CE compliance tracker (Pro)
└── context/
    ├── avatar.md       # Buyer persona
    └── language-bank.md # Real buyer language
```

## Known Limitations (MVP)

- No backend — all data stored in browser localStorage
- No Stripe integration yet — license key is honor-system with client-side validation
- No email/SMS reminders — UI exists but no sending mechanism
- No multi-device sync — data is per-browser
- Client booking page is therapist-side only (no public-facing booking portal yet)
