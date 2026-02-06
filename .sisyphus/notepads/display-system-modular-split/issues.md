# Issues

## Verification environment constraints
- Project-level `lsp_diagnostics(filePath='.')` is not available due no configured root extension mapping.
- `bun` is not installed (`bun run build` and `bun test` fail with command not found).
- For this repo, practical verification is via static hosting + browser interaction checks and direct file inspection.

## Task 2 Fix: ES Module Syntax in Classic Script

### Root Cause
`display_system/state.js` contained ES6 `export` statements (`export const State`, `export { ... }`) but was loaded as a classic `<script src="display_system/state.js"></script>` in HTML. Classic scripts don't support ES module syntax, causing browser syntax errors.

### Fix Applied
Removed all `export` statements from `display_system/state.js`. The file now uses only classic JavaScript:
- Removed `export { defaultData, config, ... }` block (lines 87-97)
- Changed `export const State` to `const State`
- Kept `window.State = State` and `window.config = config` assignments for global access

### Outcome
- `state.js` now valid as classic script (no `export` keywords)
- All state exports available via `window.*` assignments
- Zero HTML changes required (no `type="module"` needed)
- Display system.js continues using global `config` and `State` objects
