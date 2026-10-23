# DriveLab — Driving Simulator & Theory Test Center

A modern, responsive HTML/CSS/JavaScript template for simulator-session discovery, local booking requests, original theory mock tests, answer review, practice-hour logging, and educational readiness tracking.

## Technical Specifications & File Structure

```
Driving Simulator & Theory Test Center/
├── assets/
│   ├── brand/
│   │   ├── favicon.svg
│   │   ├── logo.svg
│   │   └── logo-white.svg
│   ├── css/
│   │   ├── style.css (main styles)
│   │   ├── dark-mode.css
│   │   ├── rtl.css
│   │   └── dashboard.css
│   ├── js/
│   │   ├── main.js (template main entry point)
│   │   ├── app.js
│   │   ├── components.js
│   │   ├── dashboard.js
│   │   ├── data.js
│   │   ├── mock-test.js
│   │   ├── public-pages.js
│   │   ├── question-bank.js
│   │   ├── theme-init.js
│   │   └── plugins/
│   ├── images/
│   └── fonts/
├── pages/
│   ├── index.html (home)
│   ├── home2.html
│   ├── about.html
│   ├── services.html
│   ├── blog.html
│   ├── contact.html
│   ├── schedule.html
│   ├── simulator-sessions.html
│   ├── theory-test-prep.html
│   ├── book-session.html
│   ├── pricing.html
│   ├── faq.html
│   ├── login.html
│   ├── register.html
│   ├── student-dashboard.html
│   ├── mock-test.html
│   ├── test-results.html
│   ├── privacy.html
│   └── terms.html
├── documentation/
│   ├── README.md (documentation index)
│   ├── INSTALLATION.md
│   ├── CUSTOMIZATION.md
│   ├── FUNCTIONALITY.md
│   ├── INTEGRATION.md
│   ├── IMAGE-SOURCES.md
│   └── QUESTION-SOURCES.md
├── index.html (root home entry point)
├── 404.html
├── robots.txt
├── sitemap.xml
└── README.md
```

## Run Locally

Serve the repository root over HTTP (for example `node scripts/serve.js` or `python3 -m http.server 4173`) and open `http://localhost:4173/`. No Node.js runtime or build step is required for normal use.

## Build and Verify

Run `npm install` once to install the development-only Playwright and formatting tools. Then use:

- `npm run build` to refresh the deployable `dist/` directory.
- `npm test` to run the functional browser suite.
- `npm run test:visual` to capture the public pages, dashboard and assessment views at the documented desktop, tablet and mobile sizes.

The runtime itself remains dependency-free: the browser loads native HTML, CSS and JavaScript modules.

## Important Limitations

- Login/profile behavior is a local browser preview, not secure authentication.
- Booking slots are configured examples, not live center inventory.
- Submitted bookings are local requests pending center confirmation.
- Completed hours are self-reported and are separate from requested sessions.
- Practice questions are original educational content, not official exam questions.
- Readiness is an educational indicator, never a pass guarantee.

See `documentation/` for customization and integration notes.
