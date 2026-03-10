# Product Requirements Document (MVP-01)
*Target: 3 Concurrent Users | Region: GCP europe-west9*

## 1. Vision & Goals
*   **Product Vision**: A unified workspace centered around an AI Reasoner agent named **"Domo"**. The workbench orchestrates a 10-step Design Thinking process, interacting with users via a primary chat interface and autonomously generating complex artifacts directly into integrated external tools (Miro, Notion, Google Workspace) via MCP. It cryptographically eliminates cognitive bias by algorithmically enforcing validation and context preservation from raw observation to final execution.
*   **MVP Objective**: To deliver a demonstrable, chat-first application with tab-based tool integration. The MVP will ingest raw transcripts and detailed field profiles via a lightweight companion app, synthesize insights using the Graph/Vector dual-database, and automatically populate the correct artifacts in Miro/Notion based on the current Design Thinking phase.
*   **Success Metrics (MVP)**:
    *   Sub-200ms real-time synchronization latency for 3 concurrent users.
    *   Successful execution of a complete D.School methodology loop without system crashes.
    *   Successful deterministic AI unblocking via Vertex AI Vector Search + Neo4j Aura RAG.

## 2. Target Audience & User Personas
*   **Persona 1: The Facilitator**: Orchestrates the workshop. Needs rigid state control over the project phases (locking phases) and visibility into algorithmic bias warnings.
*   **Persona 2: The Participant (Researcher/Designer)**: Needs a frictionless, highly responsive ingestion mechanism (the Companion App) to upload qualitative data. Cannot advance the overall workshop state.
*   **Persona 3: "Domo" (The AI Agent)**: The orchestrator. An active, autonomous agent functioning as a "Devil's Advocate" and unblocker. It manages the context window, queries the vector/graph backend, and executes MCP tool calls to build artifacts in external tabs.

## 3. Core Mechanics & UI Flow
*   **The Main Interface (Tabbed Navigation)**:
    *   **Tab 1: "Domo" (Command Center)**: A continuous chat interface. The user converses with Domo to synthesize data, challenge assumptions, or initiate actions.
    *   **Tab 2: Miro Board**: A framed view of the project's Miro workspace. Features a dedicated `dt.workbench` app sidebar allowing for manual drag-and-drop of available artifacts (if the user doesn't want Domo to auto-place them).
    *   **Tab 3: Notion Database**: Framed view of project documentation (PRDs, Strategy Briefs). *Note: The target Notion workspace/root page URL is configured by the Facilitator at the creation of each specific project.*
    *   **Tab 4: Google Workspace**: Framed view (or deep links) for GDrive artifacts like Docs or Sheets.
    *   **Tab 5: Google Calendar**: Framed view for scheduling. Domo can automatically add workshop events, synthesis deadlines, or team syncs to personal and team calendars.
    *   **Tab 6: Gmail**: Framed view for generating and drafting multiple emails for a given mailing list shared with Domo (e.g., stakeholder updates, user interview requests). *Note: Domo only saves these as Drafts; the sending action must be manually executed by the human user.*
*   **Background Artifact Generation (Toast Notifications)**: When Domo executes an action in an external tool (e.g., generating a User Journey Map in Miro), it does *not* auto-switch the user's active tab. Instead, it surfaces a non-intrusive Toast Notification in the UI, allowing the user to click the notification to switch tabs when they are ready.

## 4. Platform Engine & Infrastructure (Core Features)

### Epic A: The Synchronized Integration Layer
*   **Feature A.1**: Phase-Gated UI State Machine (Inspiration vs Ideation vs Implementation modes dictating available Domo commands). *Note: While users cannot advance to locked phases prematurely, they can freely navigate back to previously unlocked phases at any time to review or update context.*
*   **Feature A.2**: The Miro `dt.workbench` Sidebar App for manual drag-and-drop. *When Domo generates a Miro artifact, it generates raw, editable Miro Shapes and Sticky Notes—not static images—allowing users to manipulate them after generation.*
*   **Feature A.3**: Multi-MCP Orchestration (Routing intents to Miro, Notion, GDocs, GCalendar, or Gmail seamlessly).
*   **Feature A.4**: Git-Type Artifact Versioning: Documents and artifacts (e.g., Stakeholder Map, Strategy Brief) support version control, allowing users to create, view, and iterate on different versions of the same document type over time without losing prior context.

### Epic B: Qualitative Ingestion & The Companion App
*   **Feature B.1**: **The "Interview Artifact" Creator**: A mobile-accessible web app. Users create structured Interview Profiles containing:
    *   *Metadata*: Interviewee Name, Age, Profession, Profile Photo, Date/Time, Location (Physical or Remote/Zoom link).
    *   *Media*: Upload `.txt` field transcripts or `.mp3`/`.wav` recordings (maximum duration of 1 hour per recording). *Note: All generated transcriptions from these audio files are strictly sent to and stored within the Notion database.*
*   **Feature B.2**: **Field Observations Log**: Within the companion app, users can rapidly record standalone "Field Observations" (e.g., watching a user struggle with a door) via quick text entry or voice memos (transcribed via GCP Whisper).
*   **Feature B.3**: Synchronous PII Sanitization via Google Cloud DLP. PII (e.g., "John Smith") is mutated to synthetic identifiers (e.g., `[PERSON_1]`) before graph insertion.
*   **Feature B.4**: Dual-write architecture: Saving absolute topological payload relationships to **Neo4j Aura** (Graph) and vectorized text segments to **Vertex AI Vector Search** (Semantic).

### Epic C: "Devil's Advocate" & AI Orchestration
*   **Feature C.1**: "Audit POV" Mechanic: Domo performs a contrarian RAG search against Vertex AI to mathematically challenge user assumptions presented in the chat. *Note: For the MVP, this Vector Search context is strictly sandboxed to the data of the **current project only**; it does not pull cross-project historical context.*
    *   **The Audit Execution**: This audit is not a continuous background process. It is triggered manually by the user clicking an explicit "Audit" button located on the new **Artifact Dashboard**.
    *   **Audit Scope**: The user can choose to trigger the Audit at three levels: 1) A single Artifact, 2) An entire Phase, or 3) An entire Gate.
    *   **Audit Output**: Executing the Audit does *not* modify the original artifacts. Instead, Domo generates a *brand new, distinct synthesis artifact* summarizing the findings, contradictions, and validation statuses of the audited scope.
*   **Feature C.2**: Bias Visualizer: Color-coding or flagging data points with low "Reliability Indices" (e.g., leading questions) in the Domo chat or Miro sidebar.
*   **Feature C.3**: Generative Unblocking: Domo suggests a "Next Step" based on the current phase, available tools, and the state of the graph.

## 5. The 10-Step Design Thinking Process (Workflow Epics)

### Gate 0 : Prep work
#### Phase 0: Preparation & Alignment
*   **Goal**: Define the initial scope, success criteria, and assemble the stakeholder team.
*   **Artifacts Available**:
    *   Team Charter & RACI Matrix (Notion).
    *   Project Kickoff Event (Google Calendar).
    *   Project Kickoff Presentation (Google Slides).
    *   Project Kickoff Video (Google Drive). 
    *   Project Kickoff Survey (Google Forms).
    *   Initial Problem Statement Draft (Google Docs).

### Gate 1 : Inspiration
#### Phase 1: Landscape & Context (Understand)
*   **Goal**: Gather secondary research, map the current market landscape, and identify constraints.
*   **Artifacts Available**:
    *   Initial Research (Notion)
    *   Initial Research Presentation (Google Slides)
    *   Initial Research Presentation Video (Google Drive)
    *   Stakeholder Map (Miro).
    *   Competitor Analysis Matrix (Notion).
    *   Ecosystem Map / Value Chain (Miro).
    *   Market Landscape Map (Miro).
    *   Market Landscape Map Presentation (Google Slides).
    *   Market Landscape Map Presentation Video (Google Drive).

#### Phase 2: Empathy Gathering (Observe)
*   **Goal**: Gather primary qualitative data (interviews and context observations) from target users via the Companion App.
*   **Artifacts Available**:
    *   Empathy Map (Miro).
    *   Raw Interview Transcripts (Notion DB).
    *   Field Observations Logs (Notion DB).
    *   Highlight Reel/Quote Synthesis Board (Miro).
    *   Empathy Gathering Presentation (Google Slides).
    *   Empathy Gathering Presentation Video (Google Drive).
    *   Empathy Gathering Survey (Google Forms).
    *   Empathy Gathering Event (Google Calendar).

#### Phase 3: Synthesis & Definition (Point of View)
*   **Goal**: Distill observations into actionable insights and define the core problem (audited by Domo).
*   **Artifacts Available**:
    *   Cross-Interview Clustering (Miro).
    *   Insight Statements (Notion)
    *   POV Statements (Notion)
    *   Rich Persona Profiles (Notion).
    *   As-Is User Journey Map (Miro).
    *   "How Might We" (HMW) Statements (Miro).
    *   Synthesis Presentation (Google Slides).
    *   Synthesis Presentation Video (Google Drive).
    *   Synthesis Presentation Survey (Google Forms).
    *   Synthesis Event (Google Calendar).

### Gate 2 : Ideation
#### Phase 4: Divergent Generation (Ideate)
*   **Goal**: Generate a wide array of conceptual solutions based on the mathematically validated HMW statements.
*   **Artifacts Available**:
    *   Brainstorming Clusters / Crazy 8s Canvas (Miro).
    *   Impact vs. Effort Matrix (Miro).
    *   Concept Voting/Dot-Voting Grids (Miro).
    *   Concept Synthesis Presentation (Google Slides).
    *   Concept Synthesis Presentation Video (Google Drive).
    *   Concept Synthesis Presentation Survey (Google Forms).

#### Phase 5: Tangible Creation (Prototype)
*   **Goal**: Build tactile, low-fidelity representations of the prioritized ideas to facilitate testing.
*   **Artifacts Available**:
    *   Low-fidelity Wireframe / Component Templates (Miro).
    *   Storyboard / Scenario Narratives (Miro).
    *   To-Be User Journey Map (Miro).
    *   To-Be User Journey Map Presentation (Google Slides).
    *   To-Be User Journey Map Presentation Video (Google Drive).
    *   To-Be User Journey Map Presentation Survey (Google Forms).

#### Phase 6: Validation (Test)
*   **Goal**: Validate prototypes with users, identify failure points, and iterate.
*   **Artifacts Available**:
    *   Usability Testing Protocol & Scripts (Notion).
    *   Feedback Capture Grid (I Like / I Wish / What If) (Miro).
    *   Validation Scorecard (Google Sheets/Notion).
    *   Usability Testing Presentation (Google Slides).
    *   Usability Testing Presentation Video (Google Drive).
    *   Usability Testing Presentation Survey (Google Forms).

### Gate 3 : Implementation
#### Phase 7: Narrative & Alignment (Storytelling)
*   **Goal**: Communicate the validated solution and rationale to executive stakeholders.
*   **Artifacts Available**:
    *   Executive Strategy Brief (Google Docs).
    *   Pitch Deck Outline (Google Slides).
    *   Executive Review Meeting (Google Calendar).
    *   Executive Review Presentation (Google Slides).
    *   Executive Review Presentation Video (Google Drive).
    *   Executive Review Presentation Survey (Google Forms).

### Phase 8: Delivery Preparation (Pilot)
*   **Goal**: Translate design artifacts into technical execution requirements for Agile teams.
*   **Artifacts Available**:
    *   PRD - Product Requirements Document (Notion).
    *   Initial User Stories Epic Board (Miro/Notion).
    *   Initial User Stories Presentation (Google Slides).
    *   Initial User Stories Presentation Video (Google Drive).
    *   Initial User Stories Presentation Survey (Google Forms).

### Phase 9: Commercial Viability (Business Model)
*   **Goal**: Ensure the validated solution aligns with a sustainable business strategy.
*   **Artifacts Available**:
    *   Business Model Canvas or Lean Canvas (Miro).
    *   Value Proposition Canvas (Miro).
    *   Business Model Presentation (Google Slides).
    *   Business Model Presentation Video (Google Drive).
    *   Business Model Presentation Survey (Google Forms).

## 6. User Stories (MVP)

### Domo Chat, Integrations & Orchestration
*   **US-1.1**: *As a Researcher, I want to tell Domo "Schedule a team synthesis review for tomorrow at 2 PM", so that it automatically creates a Google Calendar event for all participants.*
*   **US-1.2**: *As a user, when Domo finishes generating an Empathy Map in Phase 2, I want to receive a subtle Toast Notification, so that my current focus isn't jarringly interrupted but I know the artifacts are ready.*
*   **US-1.3**: *As a Researcher, I want to open a sidebar within the Miro tab (`dt.workbench` app) that lists the raw, editable sticky notes Domo just generated, so that I can manually drag-and-drop them onto the canvas and modify them if I prefer manual layout.*
*   **US-1.4**: *As a Facilitator, I want to tell Domo "Draft an update email to the executive stakeholders list", so that it generates multiple drafted emails for that list in the Gmail tab, leaving the final "Send" button for me to click.*
*   **US-1.5**: *As a Designer, I want to view previous iterations of a Stakeholder Map, so that I can revert or compare changes over time using Git-style workflow versioning without breaking the main timeline.*

### Engine: Qualitative Ingestion (Companion App)
*   **US-2.1**: *As a Researcher in the field, I want to create a new "Interview Profile" in the Companion App with a photo, age, and location, so that my quantitative metadata is permanently linked to the qualitative transcript.*
*   **US-2.2**: *As a Researcher, I want to tap a "Field Observation" button to quickly record a 30-second voice memo of a user struggling to open a door, so that raw situational data is piped directly into the Knowledge Graph.*
*   **US-2.3**: *As a Participant, I want the system to automatically mutate PII (like emails or names) with `[EMAIL_1]` or `[PERSON_1]` via Cloud DLP before it reaches the Graph database, ensuring GDPR compliance.*

### Engine: AI Devil's Advocate & Bias Mitigation
*   **US-3.1**: *As a Facilitator, I want Domo to algorithmically reject a proposed POV in the chat if there is insufficient supporting node density (graph count), so that we don't build features on unvalidated assumptions.*
*   **US-3.2**: *As a Participant, I want Domo to warn me with a visual indicator if my uploaded transcript contains highly biased "leading questions", applying a "low reliability" score to those Neo4j nodes.*

### Process Flow & Governance
*   **US-4.1**: *As a Facilitator, I want to lock the active phase to "Observe" (Phase 2) within Gate 1, so that Domo will refuse to execute "Ideate" generating commands for participants, forcing adherence to the methodology.*
*   **US-4.2**: *As a Facilitator, I want a visual Breadcrumb of the Gates (0-3) and the 10-step process in the main UI, so that the entire team knows exactly which Gate and Phase we are currently in.*
*   **US-4.3**: *As a Participant, I want to click on a previously unlocked phase (e.g., Phase 1) in the bottom breadcrumb, so that I can update an artifact from the past without advancing the workshop state.*

## 7. Out of Scope for MVP (Future Versions)
Because we are restricting the MVP to a 3-user local deployment via GCP `europe-west9`, the following features explicitly described in the comprehensive Whitepaper are **OUT OF SCOPE** and will not be built:
1.  **Complex Custom Canvas Engine**: The workbench will leverage Miro's engine entirely for spatial layouts. We will not build a custom React Flow canvas engine for the MVP.
2.  **Complex Multi-tenant Authentication & RBAC**: The companion app and main interface will use simple token-based or dummy authentication. Multi-Org RBAC is deferred.
3.  **Real-Time Collaborative Editing inside the Workbench**: Real-time collaboration occurs natively inside the Miro/Notion iframes; the Workbench itself acts as the single-user AI orchestration layer.
4.  **Continuous Background Polling Daemons**: The "AI Devil's Advocate" constantly polling the database for "staleness" will be replaced by user-triggered UI prompts (e.g., asking Domo for help) to save infrastructure costs.
5.  **Multi-region Distributed Deployments**: Deferred.
6.  **Bidirectional Continuous Miro Sync**: Deferred. We will orchestrate updates via discrete MCP Tool executions triggered by chat, avoiding the state complexities of continuous bidirectional Webhook polling.
7.  **Automated Cascade Deletion Protocol (GDPR Right-to-be-Forgotten)**: Deferred. Standard database wiping will be handled manually by devs for the 3-user pilot.
