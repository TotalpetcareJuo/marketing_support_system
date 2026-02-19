---
description: Initialize the JUO Marketing Support System dev environment
---

# /init — Project Initialization

This workflow orients the AI assistant to the current state of the JUO Marketing Support System and prepares it to help effectively.

## Steps

1. Read `AGENTS.md` to refresh coding guidelines, file structure, and conventions.

2. List the root directory to see all current files and understand the project scope.

3. Ask the user what they'd like to work on today, and summarize:
   - The key files currently in the project (HTML pages, JS modules, CSS)
   - Any recent context from conversation history that may be relevant
   - What the assistant is ready to help with (new features, bug fixes, content updates, etc.)

> **Note**: There is no build step needed. The project uses a local HTTP server (`python -m http.server 8000` or `npx serve`) to serve static files. Playwright tests can be run with `npx playwright test`.
