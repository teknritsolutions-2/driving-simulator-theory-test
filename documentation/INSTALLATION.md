# Installation & Deployment

DriveLab is a standalone, buildless HTML5/CSS3/JavaScript website template requiring zero build steps or package managers.

## Hosting & Deployment
1. Upload the template folder containing `assets/`, `pages/`, and `documentation/` to any web server, CDN, or static hosting provider (e.g., Netlify, Vercel, GitHub Pages, Cloudflare Pages, Apache, NGINX, or AWS S3).
2. The primary landing page is located at `pages/index.html`.
3. All internal links and asset references are strictly relative, ensuring seamless operation from any directory or subpath.

## Local Development
To preview locally:
- Open `pages/index.html` directly in any modern web browser, or
- Serve using any lightweight HTTP server, such as:
  ```bash
  python3 -m http.server 8000
  ```
  Then navigate to `http://localhost:8000/pages/index.html`.
