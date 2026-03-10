# Track 6: Domo AI Orchestrator
**Branch to create:** `epic/6-domo-reasoner`

## Your Context
You are an autonomous AI developer working on the `dt-workbench-monorepo`. This is a collaborative project broken into 6 parallel tracks to avoid merge conflicts. 

**Your specific objective is Track 6: Domo AI Orchestrator.** You are responsible for bringing the "Devil's Advocate" AI to life. You write the prompts, the RAG retrieval logic, and the UI components for the chat.

## Required Reading
Before writing code, you **must** read the following documentation located in the `docs/` folder:
1. `docs/MVP_01_PRD.md` (CRITICAL: Epic C dictates exactly how the "Audit POV" and "Bias Visualizer" mechanics function)
2. `docs/03_UI_UX_DESIGN.md` (for the Domo visual persona, conversational tone, and the Inline Mini-Graph requirement)
3. `docs/05_INTEGRATIONS.md` (to understand how to call the MCP tools Track 5 is building)

## Your Scope of Work
*   **Target Directory**: `apps/web/`
*   **Tasks**:
    1.  Implement the React Chat UI in the Right Sidebar (or Main Tab depending on view), explicitly rendering Domo's 9-state Ghost/Lightbulb avatar based on the interaction state.
    2.  Build the custom **"Mini-Graph"** React component for rendering Nodes/Edges inline within Domo's chat bubbles, complete with HTML highlighting and Notion hyperlinks.
    3.  Build the Orchestrator Middleware API route: A function using `Promise.all()` to concurrently query Vertex AI (Semantic) and Neo4j (Topological) to assemble context before passing it to the language model.
    4.  Implement the **"Audit"** mechanic triggered from the Artifact Dashboard, ensuring it generates a *brand new Synthesis artifact* rather than augmenting existing ones.
    5.  Write the intent-routing logic to trigger the various MCP functions (e.g., figuring out when a user wants to "Export to Notion").

## Strict Boundaries (DO NOT CROSS)
*   **DO NOT** write the base schema architectures for the databases. Assume Track 4 has provided you the Prisma/Cypher clients.
*   **DO NOT** write the raw MCP API connector logic for Notion or Miro. Assume Track 5 has built generic `exportToNotion()` functions you can call.
*   **DO NOT** build the core app layout or Tailwind 3M-Post-It shell. Stick strictly to the Chat UI and Orchestration logic.

## Vibe-Coding Best Practices
*   **Wait for Track 1**: Do not begin your execution until `epic/1-foundation` has been fully merged into `main`, as you rely on the initialized Next.js/Monorepo structure.
*   **Commit Frequently**: Commit your code after every single successful micro-task. If you break something, the human supervisor can cleanly revert it.
*   **Mock Everything Until Integration**: Rely on mock data arrays and placeholder functions. Track 4 and 5 are building the DBs and Integrations you need. Polyfill their database calls with hardcoded Vertex/Neo4j mock returns.
*   **Isolate Your Workspace**: Ensure your operations stay strictly within your target directory to prevent cross-contamination.

## Definition of Done
You are finished when a user can type a message into the Domo chat, the middleware successfully fetches dummy context from Neo4j/Vertex, the LLM streams a response adopting the "firm but conversational" tone, and the UI occasionally returns a mock Mini-Graph.
