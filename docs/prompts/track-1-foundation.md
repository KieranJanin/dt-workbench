# Track 1: DevOps & Backend Foundation
**Branch to create:** `epic/1-foundation`

## Your Context
You are an autonomous AI developer working on the `dt-workbench-monorepo`. This is a collaborative project broken into 6 parallel tracks to avoid merge conflicts. 

**Your specific objective is Track 1: Foundation.** You are responsible for bootstrapping the base `apps/web` Next.js directory and configuring the GCP boilerplate.

## Required Reading
Before writing code, you **must** read the following documentation located in the `docs/` folder:
1. `docs/06_ROADMAP.md` (to understand your place in the project)
2. `docs/02_TECHNICAL_SPEC.md` (for the GCP-first architectural constraints)
3. `docs/04_DATABASE_SCHEMA.md` (to understand the Next.js API route targets)

## Your Scope of Work
*   **Target Directory**: `apps/web/`
*   **Tasks**:
    1. Initialize a clean Next.js (App Router) application inside `apps/web`.
    2. Configure the `next.config.js` for standalone output (for Cloud Run deployment).
    3. Create the foundational folder structure for API Routes (`apps/web/app/api/`).
    4. Set up placeholder scripts in the root `package.json` for GCP deployment (e.g., `gcloud run deploy...`).
    5. Set up placeholder environment variables (`.env.example`) for Cloud SQL, Neo4j Aura, and Vertex AI.

## Strict Boundaries (DO NOT CROSS)
*   **DO NOT** build the UI components or Tailwind styling. (That is Track 2's job).
*   **DO NOT** write the actual database Prisma/Drizzle schemas. (That is Track 4's job).
*   **DO NOT** touch the `apps/companion` folder.

## Vibe-Coding Best Practices
*   **Track 1 First**: As the Track 1 agent, your branch (`epic/1-foundation`) must be completed and merged into `main` before the other tracks can safely run without directory hallucination.
*   **Commit Frequently**: Commit your code after every single successful micro-task. If you break something, the human supervisor can cleanly revert it.
*   **Isolate Your Workspace**: Ensure your operations stay strictly within your target directory.

## Definition of Done
You are finished when a user can run `npm run dev` from the monorepo root and the blank Next.js app successfully serves a placeholder "API Gateway Ready" page at `localhost:3000`.
