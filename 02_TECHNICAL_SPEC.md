# Technical Specification & Architecture - MVP Design Decisions

This document outlines the architectural decisions for the Minimum Viable Product (MVP) of the Unified Design Thinking Workbench. The design is optimized for:
1.  **Scale**: At most 3 concurrent users (demo/pilot phase).
2.  **Location**: Primary deployment in France (GCP `europe-west9` - Paris).
3.  **Infrastructure**: Exclusively Google Cloud Platform (GCP).
4.  **Maintainability:** Utilizing managed, serverless tools where possible to minimize operational overhead.

---

## 1. Architecture Overview
*   **System Components & Boundary**:
    *   *Decision:* Backend services will be deployed entirely on **Google Cloud Run**. Because the MVP targets a max of 3 concurrent users, deploying a managed Kubernetes cluster (GKE) is unnecessary overhead. Cloud Run scales down to zero (cost-effective) and scales up instantly to handle burst ingestion asynchronously.
    *   *Decision:* No multi-region architecture is necessary for the MVP. All services (Cloud SQL, Neo4j Aura, Vertex AI, Cloud Storage) will be localized to the **`europe-west9` (Paris)** region to minimize latency for French users and ensure GDPR/sovereignty compliance.
*   **Hosting & Infrastructure**:
    *   *Decision:* The Next.js frontend will be containerized and hosted natively on **Google Cloud Run**, placed behind a **Google Cloud Load Balancer** with **Cloud CDN** enabled for asset caching. This keeps the entire stack within the GCP console.
    *   *Decision:* We will rely solely on **Google Cloud Operations Suite** (Cloud Logging, Trace). We do not need the complexity of Datadog or Splunk for a 3-user MVP.

## 2. Technology Stack
*   **Frontend**: React (Next.js), TailwindCSS
    *   *Decision:* We will utilize **Zustand** instead of Redux. Zustand provides sufficient global UI state management for phase-gating with dramatically less boilerplate. It is simpler and highly maintainable.
    *   *Decision:* For the spatial canvas, we will implement **React Flow**. Building a WebGL engine from scratch is over-engineering for an MVP. React Flow natively supports high interactivity, grouping, and easily scaling up to the number of nodes expected from 3 users.
*   **Mobile Client**: React Native / Expo
    *   *Decision:* Audio/video payloads will be flushed immediately to the API Gateway using basic asynchronous Fetch/Upload requests. For 3 concurrent users, establishing a complex offline-first offline queue (like WatermelonDB) is deferred to V2. We will use a simple local async-storage queue with automatic retry loops.
*   **Backend Services**: Next.js API Routes & Python Audio Workers
    *   *Decision:* The API Gateway will be natively handled by **Next.js API Routes** running on the frontend Cloud Run instance (Backend-for-Frontend pattern). This eliminates the need to configure Apigee or a standalone Gateway service. Specialized Python workers (Whisper) will run on separate Cloud Run instances triggered by Pub/Sub.

## 3. Database Architecture & Dual-Write Paradigm
*   **Relational Database (Cloud SQL for PostgreSQL)**:
    *   *Decision:* We will provision the smallest scalable instance (e.g., `db-f1-micro` or `db-g1-small`) of Cloud SQL. Complex table partitioning is **not required** for an MVP targeting <1000 total workshop sessions.
*   **Graph Database (Neo4j Aura)**:
    *   *Decision:* We will utilize the **Neo4j Aura Free/Starter tier** hosted on GCP. The node/edge density for 3 concurrent users, even after multiple workshops, will effortlessly fit within a basic instance (typically supporting under 50,000 nodes).
*   **Vector Search & AI Embeddings (Vertex AI)**:
    *   *Decision:* We will standardize on the `text-embedding-004` model. For chunking, we will maintain simplicity: chunking raw text by sentence/paragraph utilizing LangChain's basic `RecursiveCharacterTextSplitter` (max 500 tokens).

## 4. Ingestion, Event Contracts, & Pub/Sub
*   **Google Cloud Pub/Sub & Workers**:
    *   *Decision:* Pub/Sub message retention will be set to the default **7 days**. If the Python Whisper worker fails, Pub/Sub will automatically retry with exponential backoff.
    *   *Decision:* Undeliverable messages will route to a standard **Dead Letter Queue (DLQ)** topic, triggering an alert in Cloud Logging for manual developer inspection.
*   **WebSocket/Event Payload Structure**:
    *   *Decision:* To avoid configuring sticky-sessions on the Cloud Run load balancer, we will orchestrate real-time event broadcasting using **Firebase Realtime Database** or **Firestore in Datastore mode** acting as the synchronization layer. It scales invisibly and provides sub-second latency for 3 users in Paris.

## 5. State Management & Real-time Collaboration
*   **CRDT Selection**: 
    *   *Decision:* We will implement **Yjs**.
    *   *Decision:* We will use **y-webrtc** (peer-to-peer) combined with a tiny **y-websocket** signaling server deployed on Cloud Run. For 3 users, this provides instantaneous sync out-of-the-box. When the Reasoner AI makes massive edits, it acts as a headless Yjs client, merging its updates into the document state.

## 6. Security & PII Sanitization
*   **Cloud DLP Firewall**:
    *   *Decision:* Streaming text via Cloud DLP will inject a 100-300ms latency penalty. This is **acceptable** since transcript generation and UI alerts are inherently asynchronous operations.
    *   *Decision:* The synthetic mapping (e.g., `[PERSON_1]` -> `John Smith`) will be stored temporarily in **Google Memorystore (Redis)** mapped to the Workshop session ID, allowing consistent token replacement throughout a single session.
*   **Data Lifecycle & Cold Storage**:
    *   *Decision:* Raw untranscripted media will bypass graph deletion complexities. We will use **Cloud Storage Object Lifecycle Management** to automatically delete encrypted raw audio/video files 30 days after creation.

## 7. AI Orchestration & RAG Strategy
*   **The Orchestrator Middleware**:
    *   *Decision:* The Orchestrator will utilize basic `Promise.all()` to query Neo4j and Vertex AI simultaneously. If Neo4j fails to return graph context within 4 seconds, the catch block will instruct the LLM to generate insights based *solely* on the Vector Search results, prioritizing UI responsiveness over total context.
*   **Generative Unblocking & AI Daemon**:
    *   *Decision:* Instead of constant graph polling, a **Google Cloud Scheduler** chron job will ping a Cloud Run endpoint once every **15 minutes**. For 3 concurrent users, this costs less than $1/month while still feeling "proactive" to the users.

## 8. External Integrations via MCP Servers
*   **Miro / Notion / Google Workspace MCP Servers**:
    *   *Decision:* We will implement a **Push/Pull on User Demand** architecture. Continuous two-way synchronization via Webhooks introduces massive state mapping complexity. For the MVP, users will explicitly click "Export to Notion" or "Sync from Miro", triggering the discrete MCP server actions synchronously.
