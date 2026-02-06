# Decisions

## Task 1: Bridge Contract Decisions (Completed)

### Decision: Window Bridge Compatibility Strategy
**Chosen Approach**: Explicit `window.handlerName = Module.handlerName` mappings

**Rationale**:
- Preserves all existing inline handlers without HTML changes
- Allows gradual migration of modules
- No bundler or build step required
- Clear, auditable contract in bootstrap file

### Decision: Module Organization
**Module Breakdown** (6 modules for 26 handlers):

| Module | Handlers | Key Functions |
|--------|----------|---------------|
| state.js | 2 | resetData, saveSettings |
| admin.js | 8 | add/remove slides, update data, checklist mgmt |
| editor.js | 6 | notice toggle, formatText, updateNotice, handlePaste |
| preview.js | 3 | previewNotice, previewSlide, closePreview |
| slideshow.js | 5 | start/stop/pause/prev/next |
| ui.js | 2 | scrollToSection, copyEmoji |

### Decision: Global State Management
**Approach**: Keep `config` as shared mutable global during migration

**Special Cases Handled**:
- Direct `config.interval`, `config.intro.title`, `config.intro.subtitle` mutations in HTML
- These are not function calls and cannot be bridged
- Resolution: Export `config` from state module and bind to window.config

### Decision: Function Signature Preservation
**Rule**: All 26 handler signatures remain EXACTLY as-is

**Verified**:
- No parameter count changes
- No argument order changes
- No return type changes
- This ensures 100% backward compatibility with inline HTML calls

### Decision: Internal Function Exposure
**Approach**: Only the 26 handlers used by HTML/templates get window bridge entries

**Internal functions (no bridge needed)**:
- renderLastSaved, renderNoticeEditor, updateNoticeEditorVisibility
- setTextColor, setLineHeight, setLetterSpacing
- renderAdminSlides, restorePreview, createAdminSlideHTML, createPetInputHTML
- startSlideInterval, updateSlideCounter, showControlsTemporarily
- generatePresentationSlides, showSlide, getStatusColor
- handlePreviewEscape

These are called internally by other functions, never directly by HTML.

### Decision: Timer/Interval Globals
**Approach**: Expose timer IDs via shared state module

**Variables to export from state module**:
- slideIntervalId
- currentSlideIndex
- isPaused
- savedRange
- controlsTimeoutId

This allows modules to import and mutate shared state without window pollution.

## Task 2: State Module Decisions

### Decision: Window Export Pattern Over ES6 Modules
**Chosen Approach**: Export state to `window` object directly from state.js

**Rationale**:
- HTML has 3 inline state mutations: `config.interval = ...`, `config.intro.title = ...`, `config.intro.subtitle = ...`
- These are NOT function calls - they are direct object property assignments
- ES6 modules create isolated scope, breaking global access
- Window export maintains compatibility with zero HTML changes required

**Implementation**:
```javascript
// In state.js
window.config = config;
window.State = State;
// ... other exports
```

### Decision: State Module API Design
**Exported Objects**:
1. **Mutable `config` object** - direct property access for inline handlers
2. **State helper object** - cleaner API for future module consumers:
   - `State.getConfig()` - get current config
   - `State.saveConfig(config)` - persist to localStorage
   - `State.resetToDefault()` - restore defaults
   - `State.updateTimestamp()` - update lastSaved timestamp
   - Timer/interval getters/setters for all shared state variables

### Decision: Keep localStorage Key Unchanged
**Key**: `juoStoreDisplayConfig_v3` (no version bump)

**Rationale**:
- Task requirement: "localStorage key remains `juoStoreDisplayConfig_v3`"
- Migration logic handles all data format changes
- No need to break existing saved data

### Decision: Global Variable Export Set
**Variables exported to window**:
- `config` - main state object (mutable)
- `slideIntervalId` - slideshow timer
- `currentSlideIndex` - slideshow position
- `isPaused` - pause state
- `pauseRemainingTime` - for pause resume logic
- `pauseStartTime` - for pause resume logic
- `controlsTimeoutId` - UI controls auto-hide timer

**Rationale**:
- These globals are used by multiple functions
- Task 1 bridge inventory identified them as dependencies
- Exporting from single source (state.js) provides clear ownership

### Decision: No Function Signature Changes
**Rule**: All 26 handler signatures remain EXACTLY as-is

**Result**:
- Zero breaking changes to existing handlers
- Zero HTML changes required
- Zero inline handler updates required
- Purely internal refactoring
