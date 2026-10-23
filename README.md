# DriveLab — Driving Simulator & Theory Test Center

A modern, responsive HTML/CSS/JavaScript template for simulator-session discovery, local booking requests, original theory mock tests, answer review, practice-hour logging, and educational readiness tracking.

## Technical Specifications & File Structure

```
template-name/
├── assets/
│   ├── css/
│   │   ├── style.css (main styles)
│   │   ├── dark-mode.css
│   │   └── rtl.css
│   ├── js/
│   │   ├── main.js
│   │   ├── dashboard.js (if applicable)
│   │   └── plugins/
│   ├── images/
│   └── fonts/
├── pages/
│   ├── index.html (home)
│   ├── about.html
│   ├── services.html
│   ├── blog.html
│   ├── contact.html
│   └── [template-specific pages]
├── documentation/
└── README.md
```

### Complete Structure

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
│   │   ├── main.js
│   │   ├── dashboard.js
│   │   ├── app.js
│   │   ├── components.js
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
│   ├── home2.html
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
└── README.md
```

## Getting Started

DriveLab is buildless and dependency-free. To preview the template:

1. Open `pages/index.html` directly in any web browser, or
2. Serve locally via HTTP:
   ```bash
   python3 -m http.server 8000
   ```
   and navigate to `http://localhost:8000/pages/index.html`.

## Features

- **Simulator Catalog & Scheduling**: Explore custom driving modules, interactive scenario previews, and appointment request workflows.
- **Theory Mock Test Engine**: Instant scoring, question navigation, topic tagging, and rationale reviews.
- **Student Dashboard**: Practice logging, score history, and visual readiness gauges stored locally in browser storage.
- **Modern Design System**: Responsive layout across mobile, tablet, and desktop viewports, dark mode support, and RTL language direction.

See `documentation/` for detailed customization and deployment notes.
