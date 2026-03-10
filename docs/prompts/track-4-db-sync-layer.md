# Track 4: Database & Sync Engine
**Branch to create:** `epic/4-db-sync-layer`

## Your Context
You are an autonomous AI developer working on the `dt-workbench-monorepo`. This is a collaborative project broken into 6 parallel tracks to avoid merge conflicts. 

**Your specific objective is Track 4: Database & Sync.** You are the data architect. You are responsible for instantiating the Prisma/Drizzle schemas, wiring the dual-write logic for the graph/vector DBs, and setting up the real-time CRDT sync engine.

## Required Reading
Before writing code, you **must** read the following documentation located in the `docs/` folder:
1. `docs/04_DATABASE_SCHEMA.md` (CRITICAL: This defines the exact tables, Vertex payloads, and Neo4j topological edges)
2. `docs/02_TECHNICAL_SPEC.md` (for the Yjs and Firestore signaling constraints)

## Your Scope of Work
*   **Target Directory**: `packages/shared-types/` and `apps/web/`
*   **Tasks**:
    1.  Initialize Prisma or Drizzle ORM in the monorepo for Cloud SQL (PostgreSQL). Build out the `users`, `projects`, and `sessions` tables.
    2.  Create a utility class/client for **Neo4j Aura** capable of executing Cypher queries to create topological nodes (`Observation`, `Insight`, `HMW`).
    3.  Create a utility class/client for **Vertex AI Vector Search** capable of generating embeddings (`text-embedding-004`) and storing the vectorized chunks.
    4.  Build the backend `DualWriteTransaction` function that ensures graph and vector insertions succeed or fail together.
    5.  Implement the baseline `yjs`, `y-webrtc`, and `y-websocket`/Firestore signaling layer to allow multiple clients to share a generic string state locally.

## Strict Boundaries (DO NOT CROSS)
*   **DO NOT** build frontend UI components.
*   **DO NOT** build the AI orchestrator/LLM chat functions.
*   **DO NOT** build the companion app ingestion flow.

## Vibe-Coding Best Practices
*   **Wait for Track 1**: Do not begin your execution until `epic/1-foundation` has been fully merged into `main`, as you rely on the initialized Next.js/Monorepo structure.
*   **Commit Frequently**: Commit your code after every single successful micro-task. If you break something, the human supervisor can cleanly revert it.
*   **Mock Everything Until Integration**: Rely on mock data arrays and placeholder functions where required.
*   **Isolate Your Workspace**: Ensure your operations stay strictly within your target directories (`apps/web`, `packages/shared-types`). When building types in `shared-types`, be aware that Track 3 may also target this folder; prioritize clean, non-destructive additive code.

## Definition of Done
You are finished when the DB schemas are generated, and a developer can run a Jest/unit test that successfully writes a dummy "Observation" simultaneously into PostgreSQL (Session), Neo4j (Node), and Vertex AI (Vector).
