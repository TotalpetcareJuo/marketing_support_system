# AGENTS.md - Coding Guidelines for JUO Marketing Support System

## Project Overview
Frontend-only marketing support system for JUO COMPANY (pet adoption business). Built with vanilla HTML/CSS/JavaScript using Tailwind CSS via CDN. Uses a modular JavaScript architecture with global state management.

## Tech Stack
- **Languages**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN), Custom CSS
- **Icons**: Lucide Icons (CDN)
- **Storage**: localStorage (client-side only)
- **Testing**: Playwright (configured, no test files yet)
- **Language**: Korean (ko) primary interface

## Build/Test Commands
- **No build system** - Static HTML project
- **No linting** - No ESLint/Prettier configured
- **Install dependencies**: `npm install` or `bun install`
- **Serve locally**: `python3 -m http.server 8000` or `npx serve`
- **Run single Playwright test**: `npx playwright test <test-file>.spec.js`
- **Run all tests**: `npx playwright test`
- **Open files directly**: Open HTML files in browser

## File Structure
```
/
├── index.html                   # Landing page (hub)
├── display_system.html          # Store display manager UI
├── display_system.js            # Main entry, bridge to modular files
├── display_system.css           # Custom styles for display system
├── materials.html               # Sales library/catalog
├── pet_insurance_slide.html     # Insurance-specific slide
├── display_system/              # Modular JS components
│   ├── state.js                 # State mgmt, defaults, migrations
│   ├── admin.js                 # Admin UI rendering functions
│   ├── editor.js                # Rich text editor logic
│   └── slideshow.js             # Slideshow/presentation logic
├── .opencode/                   # OpenCode configuration
├── package.json                 # Dev dependencies (Playwright)
└── .gitignore                   # Git ignore rules
```

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Language attribute: `lang="ko"`
- Meta charset: `UTF-8`
- Tailwind CDN: `https://cdn.tailwindcss.com`
- Lucide CDN: `https://unpkg.com/lucide@latest`
- Initialize icons: `lucide.createIcons()` in script tag

### CSS
- Primary brand color: `#FF7A00` (JUO Orange)
- Use Tailwind utility classes as primary styling method
- Custom CSS in `<style>` blocks for:
  - Custom scrollbars (`.custom-scroll`)
  - Brand color utilities (`.text-juo-orange`, `.bg-juo-orange`)
  - Animation/transitions (`.hover-card`, `.slide-card`)
  - Component-specific styles
- Font: Noto Sans KR (Google Fonts)
- Background: `#f8fafc` (slate-50)

### JavaScript
- Use `const` and `let` (no `var`)
- camelCase for variables and functions
- PascalCase for constructor-like objects
- Event listeners: `DOMContentLoaded` for init
- localStorage key: `juoStoreDisplayConfig_v3`
- Comment sections with `// ---- Section Name ----`
- Migration comments for data version updates

### Naming Conventions
- **Files**: lowercase with underscores (`display_system.js`)
- **Variables/Functions**: camelCase (`renderLastSaved`, `currentSlideIndex`)
- **CSS Classes**: kebab-case (`.slide-card`, `.text-juo-orange`)
- **Data Keys**: snake_case within objects (`pet1`, `checklist`)

### Error Handling
- Use `try/catch` for DOM manipulation that might fail
- Log errors to console with descriptive messages
- Graceful fallbacks to default data
- Check element existence before manipulation

### Data Patterns
- Default data structure with fallbacks
- Version migration logic for localStorage updates
- State management with global config object
- Image storage: Base64/DataURL in localStorage

### Comments
- Section headers: `// ---- Section Name ----`
- Migration notes: `// MIGRATION: description`
- Critical logic: `// CRITICAL: explanation`
- Inline comments for complex logic

### Module System
- **No ES Modules**: Uses vanilla script tags, NOT `import`/`export`
- Script loading order in `display_system.html` matters:
  1. `state.js` (creates global `config` object)
  2. `admin.js`, `editor.js`, `slideshow.js` (depend on `config`)
  3. `display_system.js` (main entry point)
- All modules communicate via global `window` object
- Add new `<script src="...">` tags before `display_system.js`

## Key Implementation Notes

### Display System (display_system.js)
- Slideshow system with configurable interval
- Pet data structure: `pet1`, `pet2` per slide
- Checklist array for pet health info
- Status values use emoji prefixes:
  - `🏠 가족 찾는 중` (Available)
  - `🌷 꽃단장 중` (Reserved)
  - `🌻 행복한 집으로` (Adopted)

### State Management
```javascript
// Standard pattern for state updates
config.field = value;
// Then call render function
renderSpecificComponent();
```

### DOM Manipulation
- Use `document.getElementById()` for single elements
- Use `querySelector`/`querySelectorAll` for complex selectors
- Save selections before toolbar interactions (rich text editor pattern)

### UI Patterns
- Cards with hover lift effect: `transform: translateY(-2px)`
- Active states use brand orange background
- Disabled states use `opacity-40 pointer-events-none`
- Consistent border radius: `rounded-3xl` for cards, `rounded-xl` for buttons
- Shadow on hover: `shadow-lg` or `hover:shadow-lg`

## Git
- Line ending normalization enabled (`.gitattributes`)
- No special commit message conventions

## Performance Notes
- Images stored as Base64 in localStorage (monitor size)
- No bundling or minification currently
- Tailwind CDN includes all utilities (no purging)
