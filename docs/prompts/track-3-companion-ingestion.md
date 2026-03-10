# Track 3: Companion App & Ingestion
**Branch to create:** `epic/3-companion-ingestion`

## Your Context
You are an autonomous AI developer working on the `dt-workbench-monorepo`. This is a collaborative project broken into 6 parallel tracks to avoid merge conflicts. 

**Your specific objective is Track 3: Companion App & Ingestion.** You are responsible for building the mobile React Native (Expo) field application, the audio processing worker, and the PII sanitization layer.

## Required Reading
Before writing code, you **must** read the following documentation located in the `docs/` folder:
1. `docs/03_UI_UX_DESIGN.md` (for the "Field Operations" dark/high-contrast UI styling)
2. `docs/MVP_01_PRD.md` (Epic B specifically, for the audio-first flow and metadata requirements)
3. `docs/04_DATABASE_SCHEMA.md` (for the dual-write flow from audio -> Notion)

## Your Scope of Work
*   **Target Directory**: `apps/companion/`, `packages/shared-types/`, and `apps/web/workers/` (if deploying python worker alongside Next.js).
*   **Tasks**:
    1. Initialize a React Native (Expo) app inside `apps/companion`.
    2. Build the high-contrast "Field Operations" UI prioritizing a massive "Record Observation/Interview" button.
    3. Build the Async form for standard Persona gathering (Name, Location, Age) that submits *alongside* the audio payload.
    4. Write a script/worker utilizing GCP Whisper (or OpenAI Whisper API if configured) to transcribe `.wav`/`.mp3` fields.
    5. Implement the GCP Cloud DLP SDK logic to mutate names/emails into `[PERSON_1]`, caching the mapping temporarily in Memorystore (Redis).

## Strict Boundaries (DO NOT CROSS)
*   **DO NOT** write to Neo4j or Vertex AI. Just get the text cleanly through Whisper and DLP.
*   **DO NOT** develop the main desktop UI layout in `apps/web`.
*   **DO NOT** write the MCP integrations for Notion exports. (Track 5 will handle routing your clean text into Notion).

## Vibe-Coding Best Practices
*   **Wait for Track 1**: Do not begin your execution until `epic/1-foundation` has been fully merged into `main`, as you rely on the initialized Monorepo structure.
*   **Commit Frequently**: Commit your code after every single successful micro-task. If you break something, the human supervisor can cleanly revert it.
*   **Mock Everything Until Integration**: Rely on mock data arrays and placeholder functions. Other tracks are building the dependencies you need.
*   **Isolate Your Workspace**: Ensure your operations stay strictly within your target directory (`apps/companion`) to prevent cross-contamination. Avoid modifying Next.js code.

## Definition of Done
You are finished when a user can open the Expo simulator, press "Record," speak a sentence containing PII, and the backend console successfully logs the sanitized, text-only Whisper transcript (e.g., `"I think [PERSON_1] dislikes the new feature."`).
