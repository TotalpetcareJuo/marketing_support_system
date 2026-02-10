# AGENTS.md - Coding Guidelines for JUO Marketing Support System

## Project Overview
Frontend-only marketing support system for JUO COMPANY (pet adoption business). Built with vanilla HTML/CSS/JavaScript using Tailwind CSS via CDN. Modular JavaScript architecture with global state management.

## Tech Stack
- **Languages**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN), Custom CSS
- **Icons**: Lucide Icons (CDN)
- **Storage**: localStorage (client-side only)
- **Testing**: Playwright (configured)
- **Language**: Korean (ko) primary interface

## Build/Test Commands
```bash
# Install dependencies
npm install  # or bun install

# Serve locally
python3 -m http.server 8000
npx serve

# Run tests
npx playwright test                    # Run all tests
npx playwright test <file>.spec.js     # Run single test file
npx playwright test --ui               # Run with UI mode
npx playwright test --headed           # Run in headed mode
npx node test-localstorage-compat.js   # Run localStorage migration test
```

## File Structure
```
/
├── index.html                       # Landing page (hub)
├── display_system.html              # Store display manager UI
├── display_system.js                # Main entry, bridge to modules
├── display_system.css               # Custom styles
├── materials.html                   # Sales library/catalog
├── pet_insurance_slide.html         # Insurance-specific slide
├── test-localstorage-compat.js      # LocalStorage compatibility test
├── display_system/                  # Modular JS components
│   ├── state.js                     # State mgmt, defaults, migrations
│   ├── admin.js                     # Admin UI rendering functions
│   ├── editor.js                    # Rich text editor logic
│   ├── slideshow.js                 # Slideshow/presentation logic
│   └── slideshow_templates.js       # HTML templates for slides
├── package.json                     # Dev dependencies (Playwright)
└── .gitignore                       # Git ignore rules
```

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Language: `lang="ko"`, charset: `UTF-8`
- Tailwind CDN: `https://cdn.tailwindcss.com?plugins=typography`
- Lucide CDN: `https://unpkg.com/lucide@latest`
- Initialize icons: `lucide.createIcons()` after DOM updates

### CSS
- Brand color: `#FF7A00` (JUO Orange)
- Tailwind utilities primary; custom CSS for:
  - Scrollbars (`.custom-scroll`)
  - Brand utilities (`.text-juo-orange`, `.bg-juo-orange`)
  - Animations (`.hover-card`, `.slide-card`)
- Font: Noto Sans KR (Google Fonts)
- Background: `#f8fafc` (slate-50)

### JavaScript
- Use `const`/`let` (no `var`)
- camelCase for variables/functions; PascalCase for constructors
- Constants: UPPER_SNAKE_CASE (`STORAGE_KEY`)
- Event listeners: `DOMContentLoaded` for init
- localStorage key: `juoStoreDisplayConfig_v3`
- Prefer early returns over nested if-statements

### Naming Conventions
- **Root files**: lowercase with underscores (`display_system.js`)
- **Module files**: lowercase (`state.js`, `admin.js`)
- **CSS classes**: kebab-case (`.slide-card`)
- **Data keys**: snake_case within objects (`pet1`, `checklist`)

### Module System
- **No ES Modules**: vanilla script tags, NOT `import`/`export`
- Script loading order matters (in `display_system.html`):
  1. `state.js` (creates global `config`)
  2. `admin.js`, `editor.js`, `slideshow_templates.js`, `slideshow.js`
  3. `display_system.js` (main entry)
- Use cache-busting: `?v=2` suffix on script src
- Expose to `window` for inline handlers:
  ```javascript
  window.functionName = functionName;
  window.ObjectName = ObjectName;
  ```

### Error Handling
- Use `try/catch` for DOM operations
- Check element existence before manipulation
- Graceful fallbacks to default data
- Log errors with descriptive messages

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
- Version migration logic for localStorage
- State management via global `config` object
- Images: Base64/DataURL in localStorage
- Pet status values with emoji prefixes:
  - `🏠 가족 찾는 중` (Available)
  - `🌷 가족 맞이 준비중` (Reserved)
  - `🌻 행복한 집으로` (Adopted)

## State Module Pattern
```javascript
// Standard pattern
const State = {
    getConfig() { return config; },
    saveConfig() { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); },
    updateTimestamp() { config.lastSaved = new Date().toISOString(); }
};
window.State = State;
```

## Git
- Line ending normalization enabled (`.gitattributes`)
- No special commit message conventions

## Performance Notes
- Images stored as Base64 in localStorage (monitor size)
- No bundling/minification
- Tailwind CDN includes all utilities
- Use `lucide.createIcons()` after any DOM update with new icons
