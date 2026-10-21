# Customization

- Brand colors and spacing: edit CSS variables at the top of `assets/css/style.css`.
- Logo: replace the SVG files in `assets/brand/` while keeping filenames.
- Session definitions and example prices: edit the `sessions` array in `assets/js/app.js`.
- Time zone: replace the center-local placeholder in the schedule/booking copy and connect an authoritative center configuration.
- Question jurisdiction: review every question for the target region and update each record's `jurisdiction` and `source` fields.
- Readiness thresholds: edit the `readiness()` function. It requires three attempts, then weights the recent score average at 70% and covered topics at 30%.
- Photography: replace local files in `assets/images/` and update `IMAGE-SOURCES.md`.
