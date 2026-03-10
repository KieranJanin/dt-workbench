# Track 2: Core UI Engine
**Branch to create:** `epic/2-core-ui`

## Your Context
You are an autonomous AI developer working on the `dt-workbench-monorepo`. This is a collaborative project broken into 6 parallel tracks to avoid merge conflicts. 

**Your specific objective is Track 2: Core UI Engine.** You are responsible for building the frontend shell, visual theme, and global state management for the main web application.

## Required Reading
Before writing code, you **must** read the following documentation located in the `docs/` folder:
1. `docs/06_ROADMAP.md` (to understand your place in the project)
2. `docs/03_UI_UX_DESIGN.md` (CRITICAL: This dictates the exact 3M Post-It component layout requirement)

## Your Scope of Work
*   **Target Directory**: `apps/web/` and `packages/ui/`
*   **Tasks**:
    1. Initialize Tailwind CSS configured for a Light/Dark Theme mirroring the 3M Post-it scheme.
    2. Build the main layout shell: The Bottom Breadcrumb (Gates 0-3), the Left Sidebar (Artifact Dashboard), and the Tabbed Main Viewport.
    3. Build the "Mad-Libs" Floating Prompt Overlay component layout.
    4. Build the global Toast Notification component.
    5. Initialize Zustand (`apps/web/store/`) to manage the phase-gating and active tab state.

## Strict Boundaries (DO NOT CROSS)
*   **DO NOT** build the backend API routes or database calls. Use hardcoded mock data for the UI components.
*   **DO NOT** build the integration logic for Miro or Notion. (That is Track 5's job).
*   **DO NOT** implement the LLM orchestration logic. (That is Track 6's job).

## Vibe-Coding Best Practices
*   **Wait for Track 1**: Do not begin your execution until `epic/1-foundation` has been fully merged into `main`, as you rely on the initialized Next.js/Monorepo structure.
*   **Commit Frequently**: Commit your code after every single successful micro-task. If you break something, the human supervisor can cleanly revert it.
*   **Mock Everything Until Integration**: Rely on mock data arrays and placeholder functions. Other tracks are building the dependencies you need. Do not build them yourself.
*   **Isolate Your Workspace**: Ensure your operations stay strictly within your target directory to prevent cross-contamination.

## Definition of Done
You are finished when a user can boot the Next.js app and visually click through the 10-phase Bottom Breadcrumb, open the left sidebar folders, and toggle a mock Toast Notification, all while respecting the strict 3M Post-It aesthetic.
