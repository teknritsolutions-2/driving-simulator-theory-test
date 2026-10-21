# Installation

The source is buildless. Upload `index.html`, `404.html`, `pages/` and `assets/` while preserving paths. The project also includes a deterministic `scripts/build.sh` that refreshes `dist/` for static hosting.

All internal links are relative, so the template works from a repository subpath. Serve through HTTP rather than opening files directly because browser storage behavior is more predictable.
