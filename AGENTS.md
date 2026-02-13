# AGENTS.md - Coding Guidelines for JUO Marketing Support System

## Project Overview
Frontend marketing support system for JUO COMPANY (pet adoption business). Hybrid architecture with vanilla HTML/CSS/JavaScript - uses both ES modules and global script patterns. Tailwind CSS via CDN, localStorage state management.

## Tech Stack
- **Languages**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN), Custom CSS
- **Icons**: Lucide Icons (CDN), Font Awesome (materials.html)
- **Storage**: localStorage | **Testing**: Playwright | **Backend**: Supabase
- **Language**: Korean (ko) primary interface

## Build/Test Commands
```bash
npm install                              # Install dependencies
python3 -m http.server 8000              # Serve locally
npx serve                                # Alternative: npm run dev

npx playwright test                      # Run all tests
npx playwright test <file>.spec.js       # Run single test file
npx playwright test --headed             # Run with browser visible
node test-localstorage-compat.js         # Custom migration test
```

## File Structure
```
├── index.html                 # Landing page (hub)
├── display_system.html        # Store display manager (global scripts)
├── display_system.js          # Main entry for display system
├── materials.html             # Sales library (ES modules)
├── display_system/            # Global script modules (NO ES modules)
│   ├── state.js               # State mgmt, defaults, migrations
│   ├── admin.js, editor.js, slideshow.js, slideshow_templates.js
├── js/                        # ES modules (materials.html)
│   ├── app.js, ui.js, store.js, supabase.js, data.js, drawing.js
└── css/                       # materials.css, scenario-pages.css
```

## Code Style Guidelines

### HTML/CSS
- `lang="ko"`, charset: `UTF-8`
- Brand color: `#FF7A00` (JUO Orange)
- Font: Noto Sans KR or Pretendard, Background: `#f8fafc` (slate-50)
- Tailwind utilities primary; custom CSS uses standard syntax (no `@apply`)

### JavaScript - Two Module Systems

**System A: ES Modules (js/, materials.html)**
```javascript
import { supabase } from './supabase.js';
export async function initData() { }
```

**System B: Global Scripts (display_system/, display_system.html)**
```javascript
// NO ES modules - vanilla script tags with load order:
// 1. state.js → 2. admin/editor/slideshow → 3. display_system.js
window.functionName = functionName;  // Expose for inline handlers
```

### Naming Conventions
- `camelCase`: variables, functions
- `PascalCase`: constructors, exported classes
- `UPPER_SNAKE_CASE`: constants (`STORAGE_KEY`)
- `kebab-case`: CSS classes, filenames (`display_system.js`)
- localStorage key: `juoStoreDisplayConfig_v3`

### Element Getter Pattern
```javascript
const elements = {
    grid: () => document.getElementById('materials-grid'),
    viewer: () => document.getElementById('viewer-overlay')
};
const grid = elements.grid();
if (!grid) return;
```

### Error Handling
- Use `try/catch` for async/DOM operations
- Check element existence: `if (!el) return;`
- Log with context: `console.error('Context:', err);`
- Prefer early returns over nested if-statements

### Comments
- Section headers: `// ---- Section Name ----`
- Migration notes: `// MIGRATION: description`
- Critical logic: `// CRITICAL: explanation`

### UI Patterns
- Hover lift: `transform: translateY(-2px)`
- Active: brand orange bg | Disabled: `opacity-40 pointer-events-none`
- Border radius: `rounded-3xl` (cards), `rounded-xl` (buttons)
- **Always call `lucide.createIcons()` after DOM updates**

## Data Patterns
- State via global `config` object with localStorage persistence
- Version migration logic in state.js
- Images: Base64 in localStorage (limit <5MB total)
- Pet status values: `🏠 가족 찾는 중` | `🌷 가족 맞이 준비중` | `🌻 행복한 집으로`

## State Module Pattern (display_system/)
```javascript
const State = {
    getConfig: () => config,
    saveConfig: (updatedConfig = config) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
};
window.State = State;
```

## Async/Event Patterns
```javascript
// Async with error handling
export async function fetchData() {
    if (cache) return cache;
    try {
        const { data, error } = await supabase.from('table').select('*');
        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Supabase fetch failed:', err);
        return fallbackData;
    }
}

// Parallel fetching
const [materials, colorMap] = await Promise.all([getMaterials(), getColorMap()]);

// Event listeners - check existence first
document.getElementById('btn')?.addEventListener('click', handler);
```

## Testing Notes
- Playwright runs headless by default; use `--headed` for debugging
- No standard .spec.js files yet - custom tests use Playwright directly
- Test migrations by injecting legacy localStorage data and reloading

## Git & Performance
- Line ending normalization via `.gitattributes`
- Cache data in memory to avoid repeated Supabase calls
- Tailwind CDN includes all utilities (larger download, no bundling)
