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
    *   **Tab 2: Miro Board**: A framed view of the project's Miro workspace. Features a dedicated `dt.workbench` app sidebar allowing for manual drag-and-drop of generated artifacts (if the user doesn't want Domo to auto-place them).
    *   **Tab 3: Notion Database**: Framed view of project documentation (PRDs, Strategy Briefs).
    *   **Tab 4: Google Workspace**: Framed view (or deep links) for GDrive artifacts like Docs or Sheets.
    *   **Tab 5: Google Calendar**: Framed view for scheduling. Domo can automatically add workshop events, synthesis deadlines, or team syncs to personal and team calendars.
*   **Autonomous Tab Switching**: When Domo executes an MCP action (e.g., "I just generated the User Journey Map in Miro"), the UI auto-switches the active tab to Miro to display the result.

## 4. Platform Engine & Infrastructure (Core Features)

### Epic A: The Synchronized Integration Layer
*   **Feature A.1**: Phase-Gated UI State Machine (Inspiration vs Ideation vs Implementation modes dictating available Domo commands).
*   **Feature A.2**: The Miro `dt.workbench` Sidebar App for manual drag-and-drop.
*   **Feature A.3**: Multi-MCP Orchestration (Routing intents to Miro, Notion, GDocs, or GCalendar seamlessly).

### Epic B: Qualitative Ingestion & The Companion App
*   **Feature B.1**: **The "Interview Artifact" Creator**: A mobile-accessible web app. Users create structured Interview Profiles containing:
    *   *Metadata*: Interviewee Name, Age, Profession, Profile Photo, Date/Time, Location (Physical or Remote/Zoom link).
    *   *Media*: Upload `.txt` field transcripts or short `.mp3`/`.wav` recordings.
*   **Feature B.2**: **Field Observations Log**: Within the companion app, users can rapidly record standalone "Field Observations" (e.g., watching a user struggle with a door) via quick text entry or voice memos (transcribed via GCP Whisper).
*   **Feature B.3**: Synchronous PII Sanitization via Google Cloud DLP. PII (e.g., "John Smith") is mutated to synthetic identifiers (e.g., `[PERSON_1]`) before graph insertion.
*   **Feature B.4**: Dual-write architecture: Saving absolute topological payload relationships to **Neo4j Aura** (Graph) and vectorized text segments to **Vertex AI Vector Search** (Semantic).

### Epic C: "Devil's Advocate" & AI Orchestration
*   **Feature C.1**: "Audit POV" Mechanic: Domo performs a contrarian RAG search against Vertex AI to mathematically challenge user assumptions presented in the chat.
*   **Feature C.2**: Bias Visualizer: Color-coding or flagging data points with low "Reliability Indices" (e.g., leading questions) in the Domo chat or Miro sidebar.
*   **Feature C.3**: Generative Unblocking: Domo suggests a "Next Step" based on the current phase, available tools, and the state of the graph.

## 5. The 10-Step Design Thinking Process (Workflow Epics)

### Gate 0 : Prep work
#### Phase 0: Preparation & Alignment
*   **Goal**: Define the initial scope, success criteria, and assemble the stakeholder team.
*   **Artifacts Generated**:
    *   Team Charter & RACI Matrix (Notion).
    *   Initial Problem Statement Draft (Google Docs).
    *   Initial Research (Notion)
    *   Initial Research Presentation (Google Slides)
    *   Initial Research Presentation Video (Google Drive)
    *   Project Kickoff Event (Google Calendar).
    *   Project Kickoff Presentation (Google Slides).
    *   Project Kickoff Video (Google Drive). 
    *   Project Kickoff Survey (Google Forms).

### Gate 1 : Inspiration
#### Phase 1: Landscape & Context (Understand)
*   **Goal**: Gather secondary research, map the current market landscape, and identify constraints.
*   **Artifacts Generated**:
    *   Stakeholder Map (Miro).
    *   Competitor Analysis Matrix (Notion).
    *   Ecosystem Map / Value Chain (Miro).
    *   Market Landscape Map (Miro).
    *   Market Landscape Map Presentation (Google Slides).
    *   Market Landscape Map Presentation Video (Google Drive).

#### Phase 2: Empathy Gathering (Observe)
*   **Goal**: Gather primary qualitative data (interviews and context observations) from target users via the Companion App.
*   **Artifacts Generated**:
    *   Empathy Map (Miro).
    *   Raw Interview Transcripts (Notion DB).
    *   Field Observations Logs (Notion DB).
    *   Highlight Reel/Quote Synthesis Board (Miro).

#### Phase 3: Synthesis & Definition (Point of View)
*   **Goal**: Distill observations into actionable insights and define the core problem (audited by Domo).
*   **Artifacts Generated**:
    *   "How Might We" (HMW) Statements (Miro).
    *   Rich Persona Profiles (Notion).
    *   As-Is User Journey Map (Miro).
    *   Synthesis Presentation (Google Slides).
    *   Synthesis Presentation Video (Google Drive).
    *   Synthesis Presentation Survey (Google Forms).

### Gate 2 : Ideation
#### Phase 4: Divergent Generation (Ideate)
*   **Goal**: Generate a wide array of conceptual solutions based on the mathematically validated HMW statements.
*   **Artifacts Generated**:
    *   Brainstorming Clusters / Crazy 8s Canvas (Miro).
    *   Impact vs. Effort Matrix (Miro).
    *   Concept Voting/Dot-Voting Grids (Miro).
    *   Concept Synthesis Presentation (Google Slides).
    *   Concept Synthesis Presentation Video (Google Drive).
    *   Concept Synthesis Presentation Survey (Google Forms).

#### Phase 5: Tangible Creation (Prototype)
*   **Goal**: Build tactile, low-fidelity representations of the prioritized ideas to facilitate testing.
*   **Artifacts Generated**:
    *   Low-fidelity Wireframe / Component Templates (Miro).
    *   Storyboard / Scenario Narratives (Miro).
    *   To-Be User Journey Map (Miro).
    *   To-Be User Journey Map Presentation (Google Slides).
    *   To-Be User Journey Map Presentation Video (Google Drive).
    *   To-Be User Journey Map Presentation Survey (Google Forms).

#### Phase 6: Validation (Test)
*   **Goal**: Validate prototypes with users, identify failure points, and iterate.
*   **Artifacts Generated**:
    *   Usability Testing Protocol & Scripts (Notion).
    *   Feedback Capture Grid (I Like / I Wish / What If) (Miro).
    *   Validation Scorecard (Google Sheets/Notion).
    *   Usability Testing Presentation (Google Slides).
    *   Usability Testing Presentation Video (Google Drive).
    *   Usability Testing Presentation Survey (Google Forms).

### Gate 3 : Implementation
#### Phase 7: Narrative & Alignment (Storytelling)
*   **Goal**: Communicate the validated solution and rationale to executive stakeholders.
*   **Artifacts Generated**:
    *   Executive Strategy Brief (Google Docs).
    *   Pitch Deck Outline (Google Slides).
    *   Executive Review Meeting (Google Calendar).
    *   Executive Review Presentation (Google Slides).
    *   Executive Review Presentation Video (Google Drive).
    *   Executive Review Presentation Survey (Google Forms).

### Phase 8: Delivery Preparation (Pilot)
*   **Goal**: Translate design artifacts into technical execution requirements for Agile teams.
*   **Artifacts Generated**:
    *   PRD - Product Requirements Document (Notion).
    *   Initial User Stories Epic Board (Miro/Notion).
    *   Initial User Stories Presentation (Google Slides).
    *   Initial User Stories Presentation Video (Google Drive).
    *   Initial User Stories Presentation Survey (Google Forms).

### Phase 9: Commercial Viability (Business Model)
*   **Goal**: Ensure the validated solution aligns with a sustainable business strategy.
*   **Artifacts Generated**:
    *   Business Model Canvas or Lean Canvas (Miro).
    *   Value Proposition Canvas (Miro).
    *   Business Model Presentation (Google Slides).
    *   Business Model Presentation Video (Google Drive).
    *   Business Model Presentation Survey (Google Forms).
    *   

## 6. User Stories (MVP)

### Domo Chat, Integrations & Orchestration
*   **US-1.1**: *As a Researcher, I want to tell Domo "Schedule a team synthesis review for tomorrow at 2 PM", so that it automatically creates a Google Calendar event for all participants.*
*   **US-1.2**: *As a user, when Domo finishes generating the Empathy Map, I want the UI to automatically switch to the Miro tab, so that I can see the populated sticky notes immediately.*
*   **US-1.3**: *As a Researcher, I want to open a sidebar within the Miro tab (`dt.workbench` app) that lists the artifacts Domo just generated, so that I can manually drag-and-drop them onto the canvas if I prefer manual layout.*

### Engine: Qualitative Ingestion (Companion App)
*   **US-2.1**: *As a Researcher in the field, I want to create a new "Interview Profile" in the Companion App with a photo, age, and location, so that my quantitative metadata is permanently linked to the qualitative transcript.*
*   **US-2.2**: *As a Researcher, I want to tap a "Field Observation" button to quickly record a 30-second voice memo of a user struggling to open a door, so that raw situational data is piped directly into the Knowledge Graph.*
*   **US-2.3**: *As a Participant, I want the system to automatically mutate PII (like emails or names) with `[EMAIL_1]` or `[PERSON_1]` via Cloud DLP before it reaches the Graph database, ensuring GDPR compliance.*

### Engine: AI Devil's Advocate & Bias Mitigation
*   **US-3.1**: *As a Facilitator, I want Domo to algorithmically reject a proposed POV in the chat if there is insufficient supporting node density (graph count), so that we don't build features on unvalidated assumptions.*
*   **US-3.2**: *As a Participant, I want Domo to warn me with a visual indicator if my uploaded transcript contains highly biased "leading questions", applying a "low reliability" score to those Neo4j nodes.*

### Process Flow & Governance
*   **US-4.1**: *As a Facilitator, I want to lock the active phase to "Observe" (Step 2), so that Domo will refuse to execute "Ideate" generating commands for participants, forcing adherence to the methodology.*
*   **US-4.2**: *As a Facilitator, I want a visual Breadcrumb of the 10-step process in the main UI, so that the entire team knows exactly which phase we are currently in.*

## 7. Out of Scope for MVP (Future Versions)
Because we are restricting the MVP to a 3-user local deployment via GCP `europe-west9`, the following features explicitly described in the comprehensive Whitepaper are **OUT OF SCOPE** and will not be built:
1.  **Complex Custom Canvas Engine**: The workbench will leverage Miro's engine entirely for spatial layouts. We will not build a custom React Flow canvas engine for the MVP.
2.  **Complex Multi-tenant Authentication & RBAC**: The companion app and main interface will use simple token-based or dummy authentication. Multi-Org RBAC is deferred.
3.  **Real-Time Collaborative Editing inside the Workbench**: Real-time collaboration occurs natively inside the Miro/Notion iframes; the Workbench itself acts as the single-user AI orchestration layer.
4.  **Continuous Background Polling Daemons**: The "AI Devil's Advocate" constantly polling the database for "staleness" will be replaced by user-triggered UI prompts (e.g., asking Domo for help) to save infrastructure costs.
5.  **Multi-region Distributed Deployments**: Deferred.
6.  **Bidirectional Continuous Miro Sync**: Deferred. We will orchestrate updates via discrete MCP Tool executions triggered by chat, avoiding the state complexities of continuous bidirectional Webhook polling.
7.  **Automated Cascade Deletion Protocol (GDPR Right-to-be-Forgotten)**: Deferred. Standard database wiping will be handled manually by devs for the 3-user pilot.
