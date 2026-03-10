# Integrations & MCP Architecture (MVP)

This document details the external API integrations for the Unified Design Thinking Workbench. The core philosophy is **"Push on Demand"** via the Model Context Protocol (MCP), meaning Domo (the AI) executes discrete actions in external tools only when explicitly triggered by user conversation chat context or UI Dashboard actions. 

We explicitly avoid continuous, bidirectional background-polling webhook architectures for the MVP to minimize state-mapping liabilities.

---

## 1. Notion API (The System of Record)
Notion acts as the primary document store for the text-heavy artifacts of the Design Thinking methodology.

*   **Integration Method**: Notion Public API (Internal Integration Token per Workspace).
*   **Targetting**: The `projects` table in Cloud SQL stores a `notion_root_url` (the base page).
*   **Primary MCP Actions**:
    *   `Create_Database`: Creates a new embedded database within the root page (e.g., "Phase 2: Raw Transcripts").
    *   `Append_Page_Block`: Appends generated text content (e.g., an Executive Strategy Brief) to a designated Notion Page.
    *   `Create_Page_In_Database`: Used to create rich, heavily nested artifacts like **Rich Persona Profiles** containing headers, bullet points, and property tags.
*   **Data Flow Constraint**: All raw Audio transcriptions from the Companion app are rigidly exported to Notion *after* passing through the GCP Cloud DLP sanitization layer.

## 2. Miro API (The Spatial Canvas)
Miro acts as the interactive mapping and conceptualization surface.

*   **Integration Method**: Miro REST API & Web SDK.
*   **Targetting**: The `projects` table in Cloud SQL stores a `miro_board_id`.
*   **The `dt.workbench` App**: The workbench relies on a dedicated iFrame app installed on the Miro board itself.
*   **Primary MCP Actions**:
    *   `Generate_Shapes`: Domo does not generate flattened PNG images. It passes structured JSON representations of Shapes, Sticky Notes, Connectors, and text geometry.
    *   `Stage_Artifacts`: Domo sends this payload to the `dt.workbench` app. The app displays these as clickable list items (e.g., `🗺️ Stakeholder_Map_v1.1`) in the sidebar.
    *   `Render_To_Canvas`: The user manually drags or clicks the item in the sidebar, causing the Miro web SDK to physically draw the native shapes onto the canvas.

## 3. Google Workspace APIs (The Utility Belt)
Integration with Google's suite for standard business operations.

### 3.1 Google Calendar API
*   **Primary MCP Action**: `Create_Event`.
*   **Usage**: Domo listens for intent like "Schedule a team synthesis review". It creates a calendar event and invites the emails associated with the `users` on the active project.

### 3.2 Gmail API
*   **Primary MCP Action**: `Create_Draft`.
*   **Usage**: Domo never sends emails autonomously. It utilizes the API to formulate a multi-recipient email (e.g., "Stakeholder Newsletter") and saves it to the Facilitator's `/Drafts` folder for manual review and human execution.

### 3.3 Google Drive / Docs / Slides
*   **Primary MCP Actions**: `Create_Document`, `Append_Text`.
*   **Usage**: While Notion handles internal, highly structured DT data, Google Workspace is utilized for client-facing/executive outbound artifacts (e.g., Gate 3 Pitch Decks, Executive Strategy Briefs). The API generates the blank document and injects the initial synthesized text outlines.

---

## 4. MCP Intent Routing Logic
When the user submits a prompt, the system must route to the correct integration.

1.  **Input**: User types: *"Draft a summary of our Phase 2 insights and put it in Notion."*
2.  **Intent Graph**: Vertex AI vector maps the semantic intent -> identifies "Document Creation" + "Notion target".
3.  **Context Assembly**: Neo4j Graph fetches all linked nodes from `Observation` -> `Insight` for the current `project_id`.
4.  **Payload Generation**: The LLM compiles the summary text.
5.  **MCP Execution**: The orchestrator triggers the `Append_Page_Block` MCP tool for the Notion Integration.
6.  **Notification**: The Next.js frontend catches the successful HTTP 200 response from the Notion API and renders a **Toast Notification** in the web app: *"Success: Insight Summary added to Notion."*
