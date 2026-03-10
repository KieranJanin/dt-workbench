# Project Roadmap & Execution Plan (MVP Parallel Tracks)

This document decomposes the entire MVP into parallelizable Epics. Each Epic is designed to be executed autonomously by an AI agent (or a human developer) operating on a dedicated Git branch. 

To maximize velocity, these 6 tracks are defined with clear boundaries to minimize merge conflicts during the core development phase.

---

## Track 1: DevOps & Backend Foundation
*   **Target Branch**: `epic/1-foundation`
*   **Goal**: Provision the infrastructure and wire up the basic Next.js backend-for-frontend.
*   **Key Tasks**:
    1.  Provision GCP resources in `europe-west9` (Cloud Run, Cloud SQL PostgreSQL, Pub/Sub, Vertex AI, Memorystore Redis, Cloud Storage, Cloud DLP).
    2.  Provision Neo4j Aura free/starter tier.
    3.  Initialize the Next.js standard repository configured for Cloud Run deployment.
    4.  Set up the base API Gateway structure using Next.js API Routes.

## Track 2: The Core UI Engine
*   **Target Branch**: `epic/2-core-ui`
*   **Goal**: Build the complete "Command Center" frontend shell without wiring up the real AI or databases yet (mock data where necessary).
*   **Key Tasks**:
    1.  Implement the global Tailwind CSS configuration for the Light/Dark **3M Post-it Theme**.
    2.  Build the persistent Layout: Bottom Breadcrumb (Gates 0-3 / 10 Phases), Left Sidebar (Artifact Dashboard), Main Viewport (Tabs), and the Right Context Sidebar.
    3.  Build the "Mad-Libs" Floating Prompt Overlay component.
    4.  Implement the global Toast Notification component.
    5.  Implement Zustand for global UI state management (Phase selection, Tab switching).

## Track 3: Companion App & Ingestion Pipeline
*   **Target Branch**: `epic/3-companion-ingestion`
*   **Goal**: Build the mobile ingestion point and the backend processing pipelines for unstructured audio.
*   **Key Tasks**:
    1.  Initialize the React Native / Expo app showcasing the high-contrast "Field Operations" theme.
    2.  Build the "Audio-First" recording UX flow and subsequent Metadata forms.
    3.  Build and deploy the Python Whisper worker on a dedicated Cloud Run instance.
    4.  Implement the GCP Pub/Sub message queue for processing audio files uploaded to Cloud Storage.
    5.  Implement the GCP Cloud DLP sanitization step and the ephemeral token mapping in Memorystore (Redis).

## Track 4: Database & Sync Engine
*   **Target Branch**: `epic/4-db-sync-layer`
*   **Goal**: Establish the schemas and dual-write ingestion logic.
*   **Key Tasks**:
    1.  Build the Cloud SQL (Prisma/Drizzle ORM) schemas for Users, Projects, and Sessions.
    2.  Implement the Neo4j CYPHER integration for writing and tracing topological relationships (e.g., Observation -> Insight -> HMW).
    3.  Implement the Vertex AI API integration for generating and storing `text-embedding-004` vectors.
    4.  Build the "Dual-Write Transaction" backend logic to natively update Neo4j and Vertex AI simultaneously.
    5.  Implement the Yjs + y-webrtc CRDT logic paired with the Firestore signaling layer for 3-user real-time sync.

## Track 5: MCP Integrations & Tooling
*   **Target Branch**: `epic/5-mcp-integrations`
*   **Goal**: Build the "Push-on-Demand" connectors for all external 3rd-party services.
*   **Key Tasks**:
    1.  **Notion API**: Implement `Create_Database` and `Append_Page_Block`. Wire up the automatic export of sanitized Transcripts.
    2.  **Miro API**: Build the standalone React `dt.workbench` iframe app. Implement the logic to render raw JSON Shapes/Stickies alongside the versioned text + emoji sidebar list.
    3.  **Google Workspace**: Implement Calendar (`Create_Event`), Gmail (`Create_Draft`), and GDocs (`Create_Document`, `Append_Text`).

## Track 6: Domo AI Orchestrator
*   **Target Branch**: `epic/6-domo-reasoner`
*   **Goal**: Bring the AI "Devil's Advocate" to life by wiring the UI chat to the RAG database pipeline.
*   **Key Tasks**:
    1.  Implement the Chat UI rendering Domo’s 9-state Ghost/Lightbulb avatar.
    2.  Build the orchestrator middleware (Promise.all) that queries Vertex AI and Neo4j for conversation context.
    3.  Implement the "Audit POV" button logic triggered from the Artifact Dashboard to generate new Synthesis artifacts.
    4.  Build the custom "Mini-Graph" data visualization React component for rendering Nodes/Edges inline within chat bubbles, complete with HTML highlighting and Notion hyperlinks.
