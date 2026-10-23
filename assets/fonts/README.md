# Fonts Directory

This directory is designated for local webfont assets (`.woff2`, `.woff`, `.ttf`).

## Default Typography Configuration
By default, the template utilizes a curated system font stack designed for crisp legibility, instantaneous offline availability, zero Cumulative Layout Shift (CLS), and optimal Core Web Vitals across all mobile and desktop devices:

```css
font-family:
  system-ui,
  -apple-system,
  "Inter",
  "Segoe UI",
  Roboto,
  Helvetica,
  Arial,
  sans-serif;
```

## Adding Custom Webfonts
To integrate self-hosted webfonts:
1. Place `.woff2` font files into this `assets/fonts/` directory.
2. Declare `@font-face` rules at the top of `assets/css/style.css`.
3. Update `--font-body` or `--font-display` CSS variables in `:root`.
