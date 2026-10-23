# JavaScript Plugins Directory

This directory is designated for modular client-side plugins and standalone third-party libraries (e.g., custom analytics integrations, chart libraries, animation utilities).

## Architecture
DriveLab is intentionally engineered with zero external JavaScript runtime dependencies to achieve ultra-fast load times, complete data privacy, and 100% offline functionality.

Any additional plugins placed in this directory can be imported into `assets/js/main.js` or `assets/js/app.js`:

```javascript
// Example:
import { myPlugin } from "./plugins/my-plugin.js";
```
