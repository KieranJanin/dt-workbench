# Track 5: MCP Integrations
**Branch to create:** `epic/5-mcp-integrations`

## Your Context
You are an autonomous AI developer working on the `dt-workbench-monorepo`. This is a collaborative project broken into 6 parallel tracks to avoid merge conflicts. 

**Your specific objective is Track 5: MCP Integrations.** You handle all outbound 3rd-party connectivity based on the Model Context Protocol (MCP) "Push On Demand" philosophy.

## Required Reading
Before writing code, you **must** read the following documentation located in the `docs/` folder:
1. `docs/05_INTEGRATIONS.md` (CRITICAL: Details the Notion, Miro, and Google Workspace exact MCP actions required)
2. `docs/MVP_01_PRD.md` (to understand what artifacts are being generated in these tools)

## Your Scope of Work
*   **Target Directory**: `apps/web/lib/mcp/` (and the discrete Miro iframe app folder)
*   **Tasks**:
    1.  **Miro**: Scaffold the `dt.workbench` React iframe app designed to sit inside Miro. Implement the logic to receive JSON payloads from the main app and use the Miro Web SDK to render raw Sticky Notes and Shapes onto the canvas.
    2.  **Notion**: Build the MCP functions for `Create_Database`, `Append_Page_Block`, and `Create_Page_In_Database`.
    3.  **Google Workspace**: Build the MCP functions for GCalendar (`Create_Event`), Gmail (`Create_Draft` strictly draft-only), and GDocs (`Create_Document`).

## Strict Boundaries (DO NOT CROSS)
*   **DO NOT** design the main Chat UI or Sidebars.
*   **DO NOT** write the LLM prompts that decide *when* to execute these MCP tools. (That is Track 6's job). Ensure your MCP tools are just pure functions awaiting execution.
*   **DO NOT** modify the database schemas.

## Vibe-Coding Best Practices
*   **Wait for Track 1**: Do not begin your execution until `epic/1-foundation` has been fully merged into `main`, as you rely on the initialized Next.js/Monorepo structure.
*   **Commit Frequently**: Commit your code after every single successful micro-task. If you break something, the human supervisor can cleanly revert it.
*   **Mock Everything Until Integration**: Build pure, isolated MCP connector functions. If you need data from a database to test, use hardcoded mock parameters. Do not build the DB layer yourself.
*   **Isolate Your Workspace**: Ensure your operations stay strictly within your target directory to prevent cross-contamination.

## Definition of Done
You are finished when you have isolated, unit-testable MCP functions for Notion, Miro, and Google Workspace, and the basic Miro `dt.workbench` iframe app can successfully draw a sticky note on a test board when provided a hardcoded JSON string.
