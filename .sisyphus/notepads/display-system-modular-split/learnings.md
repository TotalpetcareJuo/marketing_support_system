# Learnings

## Task 1: Handler Inventory Analysis (Completed)

### Handler Distribution Pattern
- **Static HTML handlers**: 30 occurrences across display_system.html
- **Dynamic template handlers**: 11 unique function names generated in JS templates
- **Total unique handlers requiring bridge**: 26

### Key Finding: Handler Density
The display_system.html has inline handlers concentrated in these areas:
1. Header actions (reset, save, start slideshow) - 3 handlers
2. Sidebar navigation (scrollToSection x4) - 4 handlers
3. Settings/Intro (direct config mutations) - 3 handlers
4. Notice editor (formatting toolbar) - 6 handlers
5. Emoji panel (copyEmoji x many) - effectively 1 unique handler
6. Slideshow controls (pause, prev, next, stop) - 4 handlers
7. Preview controls (close) - 1 handler

### Template-Generated Handler Pattern
The createPetInputHTML() function generates the most complex inline handlers:
- Each pet card has ~8 handler bindings
- With 2 pets per slide and multiple slides, this scales to many DOM bindings
- All use the same function signatures with different parameters

### Direct State Mutations (Special Cases)
Three inline expressions mutate `config` directly:
- `config.interval = parseInt(this.value) || 8`
- `config.intro.title = this.value`
- `config.intro.subtitle = this.value`

These are NOT function calls - they require `config` to remain a global/shared object.

### Global State Dependencies
Beyond handlers, these globals must be maintained:
- `config` - main state object
- `slideIntervalId` - slideshow timer
- `currentSlideIndex` - slideshow position
- `isPaused` - slideshow state
- `savedRange` - editor selection
- `controlsTimeoutId` - UI timer

### Bridge Contract Structure
The 26 handlers naturally group into 6 modules:
1. State/Storage (2 handlers)
2. Admin/Data (8 handlers)
3. Editor (6 handlers)
4. Preview (3 handlers)
5. Slideshow (5 handlers)
6. UI/Utils (2 handlers)

### Consistency Verification
- Scanned: 553 lines of HTML, 1187 lines of JS
- Found: 40 function definitions in JS
- Mapped: 26 handlers to bridge
- Unmapped: 0 (100% coverage)

## Task 2: State Module Extraction (Completed)

### ES6 Module vs Global Scope Dilemma
- Initial attempt used ES6 `import/export` syntax
- Problem: HTML inline handlers require global scope (e.g., `config.interval = ...`)
- Problem: Module scripts create separate scope, breaking global access
- Resolution: Export to `window` object directly from state.js module

### State Module Structure
- **File**: `display_system/state.js` (133 lines)
- **Exports to window**: `config`, `State`, `slideIntervalId`, `currentSlideId`, `isPaused`, `pauseRemainingTime`, `pauseStartTime`, `controlsTimeoutId`
- **State API**: `State.getConfig()`, `State.saveConfig()`, `State.resetToDefault()`, `State.updateTimestamp()`
- **Storage key**: `juoStoreDisplayConfig_v3` (unchanged)

### Migration Preservation
All 4 migrations preserved exactly from original code:
1. **Checklist migration**: v2 to v3 - converts `check1/check2/check3` to `checklist` array
2. **Notice fallback**: adds missing notice object with default content
3. **Intro fallback**: adds missing intro object with default title/subtitle
4. **Status wording**: updates old status values to new emotional wording (🏠, 🌷, 🌻 emojis)

### Mutable Shared State Strategy
- `config` exported as mutable global object
- Direct inline mutations in HTML still work:
  - `oninput="config.interval = parseInt(this.value) || 8"`
  - `oninput="config.intro.title = this.value"`
  - `oninput="config.intro.subtitle = this.value"`
- No function signature changes required

### Integration Changes
- **display_system.html**: Added `<script src="display_system/state.js"></script>` before display_system.js
- **display_system.js**: Removed 77 lines (7-83) of state initialization code
- **display_system.js**: Removed `let controlsTimeoutId = null` declaration (now from state.js)
- **display_system.js**: No other changes - all existing functions continue using global `config`

### Verification Results
- localStorage key verified: `juoStoreDisplayConfig_v3` ✓
- Default data structure preserved exactly ✓
- All migration blocks present ✓
- Inline state mutations still work ✓
- No variable name changes ✓
- No function signature changes ✓
LEARNINGS_EOF'

## Task 2: State Module Extraction (Completed)

### ES6 Module vs Global Scope Dilemma
- Initial attempt used ES6 `import/export` syntax
- Problem: HTML inline handlers require global scope (e.g., `config.interval = ...`)
- Problem: Module scripts create separate scope, breaking global access
- Resolution: Export to `window` object directly from state.js module

### State Module Structure
- **File**: `display_system/state.js` (133 lines)
- **Exports to window**: `config`, `State`, `slideIntervalId`, `currentSlideId`, `isPaused`, `pauseRemainingTime`, `pauseStartTime`, `controlsTimeoutId`
- **State API**: `State.getConfig()`, `State.saveConfig()`, `State.resetToDefault()`, `State.updateTimestamp()`
- **Storage key**: `juoStoreDisplayConfig_v3` (unchanged)

### Migration Preservation
All 4 migrations preserved exactly from original code:
1. **Checklist migration**: v2 to v3 - converts `check1/check2/check3` to `checklist` array
2. **Notice fallback**: adds missing notice object with default content
3. **Intro fallback**: adds missing intro object with default title/subtitle
4. **Status wording**: updates old status values to new emotional wording (🏠, 🌷, 🌻 emojis)

### Mutable Shared State Strategy
- `config` exported as mutable global object
- Direct inline mutations in HTML still work:
  - `oninput="config.interval = parseInt(this.value) || 8"`
  - `oninput="config.intro.title = this.value"`
  - `oninput="config.intro.subtitle = this.value"`
- No function signature changes required

### Integration Changes
- **display_system.html**: Added `<script src="display_system/state.js"></script>` before display_system.js
- **display_system.js**: Removed 77 lines (7-83) of state initialization code
- **display_system.js**: Removed `let controlsTimeoutId = null` declaration (now from state.js)
- **display_system.js**: No other changes - all existing functions continue using global `config`

### Verification Results
- localStorage key verified: `juoStoreDisplayConfig_v3` ✓
- Default data structure preserved exactly ✓
- All migration blocks present ✓
- Inline state mutations still work ✓
- No variable name changes ✓
- No function signature changes ✓

## Task 2: Migration QA Verification (Completed)

### QA Test Summary
- **Date**: 2026-02-06
- **Test Script**: `test-migration.js` (Playwright-based automation)
- **Evidence**: `.sisyphus/evidence/task-2-migration.png`, `.sisyphus/evidence/task-2-migration.txt`

### Migration Behavior Verified
1. **Status Migration**: All old status values correctly converted to emoji format:
   - `분양 가능` → `🏠 가족 찾는 중` ✓
   - `예약 대기` → `🌷 꽃단장 중` ✓
   - `분양 완료` → `🌻 행복한 집으로` ✓

2. **Checklist Migration**: Legacy `check1/check2/check3` string values migrated to `checklist` array:
   - Empty strings (falsy) correctly excluded from array
   - Non-empty strings correctly added to array
   - Old properties preserved (not removed - acceptable behavior)

3. **Error Handling**: No console errors for `State is not defined` or `config is not defined` ✓

### Key Insight: In-Memory vs localStorage
- Migration happens in-memory during `initializeConfig()` 
- Migrated data is NOT automatically saved back to localStorage
- This is acceptable behavior - migration runs on every page load
- Test verifies `window.config` (in-memory) not localStorage

## Task 2 QA Migration Test (2026-02-06)

**Observation**: Legacy localStorage migration after state module extraction works correctly.

**Migration Logic Verified**:
- Old `check1/check2/check3` fields → `checklist[]` array (skipping empty values)
- "분양 가능" → "🏠 가족 찾는 중"
- "예약 대기" → "🌷 꽃단장 중"  
- "분양 완료"/"완료" → "🌻 행복한 집으로"

**Key Finding**: The migration in `display_system/state.js` runs correctly without needing the old `display_system.js` file. The State module successfully exports `window.config` and `window.State` for backward compatibility.

**Test Strategy**: Injecting legacy payload via Playwright `page.evaluate()` before reload is an effective way to test migration scenarios without manual UI interaction.

## Task 3: Admin Module Extraction (Completed)

- Admin rendering/data mutation functions were successfully isolated into `display_system/admin.js` and loaded before `display_system.js`.
- Inline handler compatibility was preserved by exposing moved functions on `window` (`addNewSlideBlock`, `updateData`, `updateChecklist`, etc.).
- `display_system.js` no longer contains admin rendering/data mutation implementation, reducing monolith size and coupling.
- QA evidence confirms admin interactions still work after extraction:
  - `.sisyphus/evidence/task-3-admin-mutations.png`
  - `.sisyphus/evidence/task-3-admin-mutations.txt`


## Task 4: Editor Module Extraction (Completed)

### Module Structure
- **File**: display_system/editor.js (314 lines)
- **Module Type**: Rich-text editor + notice preview
- **Dependencies**: Global config object (from state.js)

### Functions Extracted (12 total)
1. **State Management**:
   - savedRange - selection preservation variable
   - Selection saving via keyup, mouseup, focus, and critically blur events

2. **Editor Functions**:
   - renderNoticeEditor() - populates editor UI from config
   - updateNoticeEditorVisibility() - toggles opacity/pointer-events based on enabled state
   - toggleNotice(enabled) - updates config.notice.enabled
   - updateNotice(field, value) - updates config.notice properties
   - formatText(command) - executes document.execCommand for bold/italic/underline/lists
   - setFontSize(size) - wraps selection in span with fontSize
   - setTextColor(color) - wraps selection in span with color
   - setLineHeight(value) - wraps selection in span with lineHeight
   - setLetterSpacing(value) - wraps selection in span with letterSpacing

3. **Paste Handling**:
   - handlePaste(e) - prevents default, inserts plain text only

4. **Preview Functions**:
   - previewNotice() - renders notice preview overlay
   - handlePreviewEscape(e) - detects Escape key to close preview
   - closePreview() - hides overlay, cleans up listeners, exits fullscreen

### Window Bridge Exports
All 12 functions explicitly exported to window:
- Required for HTML inline handlers: onclick="formatText('bold')", etc.
- Required for dynamic template handlers: all editor toolbar actions
- Preview functions exposed: previewNotice(), closePreview()

### Key Pattern: Selection Restoration
The rich-text editor uses a sophisticated selection preservation mechanism:
1. Capture selection on keyup, mouseup, focus, and critically blur
   - Blur is CRITICAL because clicking toolbar buttons causes editor to lose focus
   - Saving before blur ensures selection persists for toolbar operations
2. Restore selection in formatting functions (setFontSize, setTextColor, etc.)
   - Use savedRange.cloneRange() to restore before applying styling
   - After DOM manipulation, create new range selecting the styled span
   - This ensures user can apply multiple styles sequentially without reselecting

### Code Quality Observations
- Exact preservation: All original comments and logic maintained
- No signature changes: All function names and parameters unchanged
- Error handling preserved: try/catch blocks for DOM manipulation
- Console logging preserved: Error messages maintained (e.g., "Selection outside editor")
- Focus restoration preserved: All formatting functions end with document.getElementById('notice-content').focus()

### Integration Changes
- display_system.html: Added <script src="display_system/editor.js"></script>
  - Placed AFTER state.js and admin.js
  - Placed BEFORE display_system.js (uses functions)
- display_system.js: 
  - Removed 248 lines (editor logic and preview functions)
  - Added migration comment markers
  - Preserved renderNoticeEditor() call in DOMContentLoaded init

### Script Loading Order (Critical)
1. display_system/state.js       - Provides window.config
2. display_system/admin.js       - Uses config, no state deps
3. display_system/editor.js      - Uses config, exposes window functions
4. display_system.js             - Uses config and window.editor* functions

This order ensures:
- config is available when editor.js loads
- Editor functions are on window when display_system.js calls them
- No race conditions or undefined reference errors

### Editor Behavior Preserved
- Rich-text commands: Uses document.execCommand() API (deprecated but functional)
- Inline toolbar actions: formatText('bold'), formatText('italic'), etc. still work
- Custom styling functions: Create <span> elements with inline styles
- Manual state updates: updateNotice('content', ...) called after DOM manipulation
  - Necessary because DOM changes don't trigger input event
  - Maintains config synchronization with editor content

### Preview Behavior Preserved
- Preview container: Hidden by default, shown via classList.remove('hidden')
- Escape key handling: keydown listener added in preview, removed in close
- Fullscreen handling: Both requestFullscreen and exitFullscreen preserved
- Lucide icons: Re-run after rendering preview content

### Limitation: Paste Testing
- Manual verification required for plain-text paste behavior
- Cannot programmatically set clipboard content via page.evaluate() easily
- Automated QA took screenshot but could not verify actual paste operation
- handlePaste(e) logic preserved exactly - uses clipboardData.getData('text/plain')

### Tool Availability Notes
- Node.js: Not available in PATH (used bash fallback methods)
- Playwright MCP: Connection timeout (used direct browser automation)
- PowerShell: Successfully used for screenshot capture
- Evidence files: Created manually via PowerShell screenshot


## Task 4: Editor Module Extraction (Completed)

### Module Structure
- **File**: display_system/editor.js (314 lines)
- **Module Type**: Rich-text editor + notice preview
- **Dependencies**: Global config object (from state.js)

### Functions Extracted (12 total)
1. **State Management**:
   - savedRange - selection preservation variable
   - Selection saving via keyup, mouseup, focus, and critically blur events

2. **Editor Functions**:
   - renderNoticeEditor() - populates editor UI from config
   - updateNoticeEditorVisibility() - toggles opacity/pointer-events based on enabled state
   - toggleNotice(enabled) - updates config.notice.enabled
   - updateNotice(field, value) - updates config.notice properties
   - formatText(command) - executes document.execCommand for bold/italic/underline/lists
   - setFontSize(size) - wraps selection in span with fontSize
   - setTextColor(color) - wraps selection in span with color
   - setLineHeight(value) - wraps selection in span with lineHeight
   - setLetterSpacing(value) - wraps selection in span with letterSpacing

3. **Paste Handling**:
   - handlePaste(e) - prevents default, inserts plain text only

4. **Preview Functions**:
   - previewNotice() - renders notice preview overlay
   - handlePreviewEscape(e) - detects Escape key to close preview
   - closePreview() - hides overlay, cleans up listeners, exits fullscreen

### Window Bridge Exports
All 12 functions explicitly exported to window:
- Required for HTML inline handlers: onclick="formatText('bold')", etc.
- Required for dynamic template handlers: all editor toolbar actions
- Preview functions exposed: previewNotice(), closePreview()

### Key Pattern: Selection Restoration
The rich-text editor uses a sophisticated selection preservation mechanism:
1. Capture selection on keyup, mouseup, focus, and critically blur
   - Blur is CRITICAL because clicking toolbar buttons causes editor to lose focus
   - Saving before blur ensures selection persists for toolbar operations
2. Restore selection in formatting functions (setFontSize, setTextColor, etc.)
   - Use savedRange.cloneRange() to restore before applying styling
   - After DOM manipulation, create new range selecting the styled span
   - This ensures user can apply multiple styles sequentially without reselecting

### Code Quality Observations
- Exact preservation: All original comments and logic maintained
- No signature changes: All function names and parameters unchanged
- Error handling preserved: try/catch blocks for DOM manipulation
- Console logging preserved: Error messages maintained (e.g., "Selection outside editor")
- Focus restoration preserved: All formatting functions end with document.getElementById('notice-content').focus()

### Integration Changes
- display_system.html: Added <script src="display_system/editor.js"></script>
  - Placed AFTER state.js and admin.js
  - Placed BEFORE display_system.js (uses functions)
- display_system.js: 
  - Removed 248 lines (editor logic and preview functions)
  - Added migration comment markers
  - Preserved renderNoticeEditor() call in DOMContentLoaded init

### Script Loading Order (Critical)
1. display_system/state.js       - Provides window.config
2. display_system/admin.js       - Uses config, no state deps
3. display_system/editor.js      - Uses config, exposes window functions
4. display_system.js             - Uses config and window.editor* functions

This order ensures:
- config is available when editor.js loads
- Editor functions are on window when display_system.js calls them
- No race conditions or undefined reference errors

### Editor Behavior Preserved
- Rich-text commands: Uses document.execCommand() API (deprecated but functional)
- Inline toolbar actions: formatText('bold'), formatText('italic'), etc. still work
- Custom styling functions: Create <span> elements with inline styles
- Manual state updates: updateNotice('content', ...) called after DOM manipulation
  - Necessary because DOM changes don't trigger input event
  - Maintains config synchronization with editor content

### Preview Behavior Preserved
- Preview container: Hidden by default, shown via classList.remove('hidden')
- Escape key handling: keydown listener added in preview, removed in close
- Fullscreen handling: Both requestFullscreen and exitFullscreen preserved
- Lucide icons: Re-run after rendering preview content

### Limitation: Paste Testing
- Manual verification required for plain-text paste behavior
- Cannot programmatically set clipboard content via page.evaluate() easily
- Automated QA took screenshot but could not verify actual paste operation
- handlePaste(e) logic preserved exactly - uses clipboardData.getData('text/plain')

### Tool Availability Notes
- Node.js: Not available in PATH (used bash fallback methods)
- Playwright MCP: Connection timeout (used direct browser automation)
- PowerShell: Successfully used for screenshot capture
- Evidence files: Created manually via PowerShell screenshot
