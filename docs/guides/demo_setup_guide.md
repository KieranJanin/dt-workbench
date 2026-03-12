# dt.workbench Demo Environment Setup Guide

To transition from the MVP mocked infrastructure to a live "Demo" environment that actually triggers real API calls to Miro, Notion, and Google Cloud, you need to spin up the actual platform accounts and services. 

Here is the step-by-step guide to setting up your live demo environment.

---

## 1. Google Cloud Platform (GCP) Infrastructure
You need a GCP project to handle the AI Agent (Vertex AI) and the PII Sanitizer (Cloud DLP).

### A. Project & Billing
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project: `dt-workbench-demo`.
3. Ensure a billing account is linked (Vertex AI and DLP require billing enabled, though you'll stay well within the free tiers for a demo).

### B. Vertex AI (The Domo Reasoning Engine)
1. In the GCP Console, search for **Vertex AI API** and click **Enable**.
2. We need the Gemini 1.5 Pro model for complex synthesis.
3. **Action:** Generate a GCP Service Account JSON key.
   - Go to **IAM & Admin > Service Accounts**.
   - Create a service account (e.g., `domo-ai-agent@dt-workbench-demo.iam.gserviceaccount.com`).
   - Grant it the `Vertex AI User` role.
   - Create and download a JSON key. Save this securely; you will use it in your `.env` file as `GOOGLE_APPLICATION_CREDENTIALS`.

### C. Cloud DLP (PII Sanitization for Track 3)
1. Search for **Cloud Data Loss Prevention (DLP) API** and click **Enable**.
2. Ensure your `domo-ai-agent` service account also has the `DLP User` role.

---

## 2. Setting Up the Notion Demo Space
Notion will act as your document repository and transcript database.

### A. The Workspace
1. Create a free Notion workspace. Name it **dt.workbench Design Hub**.
2. Create a root page called **Demo Project Alpha**.

### B. The Internal Integration (API Key)
1. Go to [Notion My Integrations](https://www.notion.so/my-integrations).
2. Click **New integration**.
3. Name it `dt.workbench-orchestrator`.
4. Select the workspace you just created.
5. Under Capabilities, ensure it can Read, Update, and Insert content.
6. Copy the **Internal Integration Secret**. You will store this in your `.env` as `NOTION_API_KEY`.

### C. The Crucial Step: Connecting the Integration
1. Go back to your Notion workspace and open the **Demo Project Alpha** page.
2. Click the `...` menu in the top right.
3. Scroll to **Connections** and click **Add connection**.
4. Search for `dt.workbench-orchestrator` and add it. If you don't do this, the API will return a 404 error when trying to write to the page!
5. Extract the **Page ID** from the URL of your root page and save it as `NOTION_ROOT_PAGE_ID` in your `.env`.

---

## 3. Setting Up the Miro Demo Board
Miro will act as your spatial and visual canvas for empathy mapping and journey mapping.

### A. The Board
1. Create a free Miro account and workspace.
2. Create a new, blank board. Name it **Demo Project - Visual Space**.

### B. The Developer App (API Key)
1. Go to the [Miro Developer Hub](https://miro.com/app/dashboard/?create_app=1).
2. Click **Create new app**.
3. Name it `dt.workbench-canvas`.
4. Check the necessary scopes: `boards:read`, `boards:write`.
5. Click **Install app and get OAuth token**. Let it install to your demo workspace.
6. Copy the **Access Token** and save it in your `.env` as `MIRO_ACCESS_TOKEN`.
7. Just like Notion, grab the **Board ID** from your demo board's URL and save it to `.env` as `MIRO_BOARD_ID`.

### C. The iFrame Integration
For the MVP, we are rendering Miro in an iframe on Tab 2.
1. In your Miro board, click the **Share** button.
2. Ensure "Anyone with the link" can view/edit (or specifically invite your demo email).
3. Copy the embed link and place it in the URL property of the Miro Tab component in `MainViewport.tsx`.

---

## 4. Setting up Google Workspace (Docs/Slides/Drive/Calendar)
For the demo, we won't build full Headless OAuth flows for every user. Instead, we'll use a single Service Account to manipulate a shared Drive folder.

1. Go to Google Drive and create a folder: **dt.workbench Demo Artifacts**.
2. Right-click the folder -> Share.
3. Share it with your GCP Service Account email (`domo-ai-agent@...`). Give it **Editor** access.
4. Go back to your GCP Console and enable the following APIs:
   - **Google Drive API**
   - **Google Docs API**
   - **Google Slides API**
   - **Google Calendar API**
5. All codebase requests will use the `GOOGLE_APPLICATION_CREDENTIALS` JSON you downloaded in Step 1 to authenticate as the service agent, dropping generated documents seamlessly into that shared Drive folder!

---

## 5. Connecting it all (The `.env` File)
Once you have generated all of the above, your final `/apps/web/.env` file will transition from mock modes to live keys:

```ini
# GCP & Vertex AI
GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/your/gcp-service-account.json"
GCP_PROJECT_ID="dt-workbench-demo"
GCP_LOCATION="europe-west9"

# Notion
NOTION_API_KEY="secret_abc123..."
NOTION_ROOT_PAGE_ID="def456..."

# Miro
MIRO_ACCESS_TOKEN="eyJhbG..."
MIRO_BOARD_ID="uXd8..."

# Neo4j (Graph DB - You will need to spin up a free Neo4j AuraDB instance)
NEO4J_URI="neo4j+s://your-db.databases.neo4j.io"
NEO4J_USERNAME="neo4j"
NEO4J_PASSWORD="your_password"
```

Once this `.env` is populated, you update the mock controllers in `lib/mcp/` to utilize the live keys, and the orchestrator becomes fully functional!
