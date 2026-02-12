# AGENTS.md - Coding Guidelines for JUO Marketing Support System

## Project Overview
Frontend marketing support system for JUO COMPANY (pet adoption business). Hybrid architecture with vanilla HTML/CSS/JavaScript - uses both ES modules and global script patterns. Tailwind CSS via CDN, modular JavaScript with localStorage state management.

## Tech Stack
- **Languages**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN v3.4+), Custom CSS
- **Icons**: Lucide Icons (CDN)
- **Storage**: localStorage (client-side only)
- **Testing**: Playwright (configured)
- **Backend**: Supabase (for materials/auth)
- **Language**: Korean (ko) primary interface

## Build/Test Commands
```bash
# Install dependencies
npm install  # or bun install

# Serve locally
python3 -m http.server 8000
npx serve                    # npm run dev

# Run Playwright tests
npx playwright test                    # Run all tests
npx playwright test <file>.spec.js     # Run single test file
npx playwright test --ui               # Run with UI mode
npx playwright test --headed           # Run in headed mode

# Run custom tests
node test-localstorage-compat.js       # localStorage migration test
```

## File Structure
```
/
├── index.html                       # Landing page (hub)
├── display_system.html              # Store display manager UI
├── display_system.js                # Main entry for display system
├── display_system.css               # Display system styles
├── materials.html                   # Sales library/catalog (ES modules)
├── test-localstorage-compat.js      # Playwright migration test
├── display_system/                  # Global script modules
│   ├── state.js                     # State mgmt, defaults, migrations
│   ├── admin.js                     # Admin UI rendering functions
│   ├── editor.js                    # Rich text editor logic
│   ├── slideshow.js                 # Slideshow/presentation logic
│   └── slideshow_templates.js       # HTML templates for slides
├── js/                              # ES modules (materials.html)
│   ├── app.js                       # App entry with Supabase auth
│   ├── ui.js                        # UI rendering (exported functions)
│   ├── store.js                     # Data layer
│   ├── supabase.js                  # Supabase client
│   └── drawing.js                   # Drawing/canvas utilities
├── css/                             # Additional styles
└── package.json                     # Dev dependencies (Playwright)
```

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Language: `lang="ko"`, charset: `UTF-8`
- Tailwind CDN: `https://cdn.tailwindcss.com?plugins=typography`
- Lucide CDN: `https://unpkg.com/lucide@latest`
- Initialize icons: `lucide.createIcons()` after DOM updates

### CSS
- **Brand color**: `#FF7A00` (JUO Orange)
- Tailwind utilities primary; custom CSS for:
  - Scrollbars (`.custom-scroll`)
  - Brand utilities (`.text-juo-orange`, `.bg-juo-orange`)
  - Animations (`.hover-card`, `.slide-card`)
- Font: Noto Sans KR (Google Fonts)
- Background: `#f8fafc` (slate-50)

### JavaScript - Two Module Systems

#### System A: ES Modules (js/ folder, materials.html)
```javascript
// Use import/export
import { supabase } from './supabase.js';
import { AppState } from './ui.js';

export async function initData() { }
export const AppState = { };
```

#### System B: Global Scripts (display_system/ folder, display_system.html)
```javascript
// NO ES modules - vanilla script tags
// Script loading order matters:
// 1. state.js (creates global config)
// 2. admin.js, editor.js, slideshow_templates.js, slideshow.js
// 3. display_system.js (main entry)

// Expose to window for inline handlers:
window.functionName = functionName;
window.ObjectName = ObjectName;

// Use cache-busting: ?v=2 suffix on script src
```

### Naming Conventions
- Use `const`/`let` (no `var`)
- **camelCase**: variables, functions
- **PascalCase**: constructors, exported modules
- **UPPER_SNAKE_CASE**: constants (`STORAGE_KEY`)
- **File names**: lowercase with underscores (`display_system.js`)
- **CSS classes**: kebab-case (`.slide-card`)
- **Data keys**: snake_case within objects (`pet1`, `checklist`)
- **localStorage key**: `juoStoreDisplayConfig_v3`

### Error Handling
- Use `try/catch` for DOM operations and async calls
- Check element existence before manipulation
- Graceful fallbacks to default data
- Log errors with descriptive messages
- Prefer early returns over nested if-statements

### Comments
- Section headers: `// ---- Section Name ----`
- Migration notes: `// MIGRATION: description`
- Critical logic: `// CRITICAL: explanation`

### UI Patterns
- Hover lift: `transform: translateY(-2px)`
- Active states: brand orange background
- Disabled: `opacity-40 pointer-events-none`
- Border radius: `rounded-3xl` (cards), `rounded-xl` (buttons)
- Shadow on hover: `shadow-lg` or `hover:shadow-lg`

## Data Patterns
- Default data structure with fallbacks
- Version migration logic for localStorage (see state.js)
- State management via global `config` object
- Images: Base64/DataURL in localStorage (monitor size!)
- Pet status values with emoji prefixes:
  - `🏠 가족 찾는 중` (Available)
  - `🌷 가족 맞이 준비중` (Reserved)
  - `🌻 행복한 집으로` (Adopted)

## State Module Pattern
```javascript
// For global script modules (display_system/)
const State = {
    getConfig() { return config; },
    saveConfig() { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); },
    updateTimestamp() { config.lastSaved = new Date().toISOString(); }
};
window.State = State;  // Always expose to window
```

## Git
- Line ending normalization enabled (`.gitattributes`)
- No special commit message conventions

## Performance Notes
- Images stored as Base64 in localStorage (monitor size, limit to <5MB total)
- No bundling/minification
- Tailwind CDN includes all utilities (larger download)
- Use `lucide.createIcons()` after any DOM update with new icons
- Playwright tests run headless by default
