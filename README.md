# DriveLab — Driving Simulator & Theory Test Center

A buildless HTML/CSS/JavaScript client template for simulator-session discovery, local booking requests, original theory mock tests, answer review, practice-hour logging and educational readiness tracking.

## Run locally

Serve the repository root over HTTP (for example `python3 -m http.server 4173`) and open `http://localhost:4173/`. No Node.js runtime or build step is required for normal use.

## Build and verify

Run `npm install` once to install the development-only Playwright and formatting tools. Then use:

- `npm run build` to refresh the deployable `dist/` directory.
- `npm test` to run the functional browser suite.
- `npm run test:visual` to capture the public pages, dashboard and assessment views at the documented desktop, tablet and mobile sizes.

The runtime itself remains dependency-free: the browser loads native HTML, CSS and JavaScript modules.

## Important limitations

- Login/profile behavior is a local browser preview, not secure authentication.
- Booking slots are configured examples, not live center inventory.
- Submitted bookings are local requests pending center confirmation.
- Completed hours are self-reported and are separate from requested sessions.
- Practice questions are original educational content, not official exam questions.
- Readiness is an educational indicator, never a pass guarantee.

See `documentation/` for customization and integration notes.
