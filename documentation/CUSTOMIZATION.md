# Customization

- Brand colors and spacing: edit CSS variables at the top of `assets/css/style.css`.
- Logo: replace the SVG files in `assets/brand/` while keeping filenames.
- Session definitions and example prices: edit the `sessions` array in `assets/js/data.js`.
- Public page structure and copy: edit `assets/js/public-pages.js`; shared navigation, cards and icons live in `assets/js/components.js`.
- Dashboard and assessment interfaces: edit `assets/js/dashboard.js` and `assets/js/mock-test.js`.
- Time zone: replace the center-local placeholder in the schedule/booking copy and connect an authoritative center configuration.
- Question jurisdiction: review every question for the target region and update each record's `jurisdiction` and `source` fields.
- Readiness thresholds: edit the `readiness()` helper in `assets/js/data.js`. It requires three attempts, then weights the recent score average at 70% and covered topics at 30%.
- Photography: replace local files in `assets/images/` and update `IMAGE-SOURCES.md`.
