# External Integrations & Data Flow

## 1. Integration Strategy Overview
*   Why we connect with these platforms.
*   Core principles: Single Source of Truth, rate limiting, and graceful degradation.

## 2. Miro Integration (Whiteboard Sync)
### API Scopes Required:
*   `boards:read`, `boards:write`
### Data Mapping Rules:
*   Our "Sticky Note" -> Miro "Sticky Note Widget"
*   Our "Group/Cluster" -> Miro "Shape/Frame"
### Authentication & Webhooks:
*   OAuth App Setup details.
*   Listening to Miro Board Events (updates, deletions via Webhook endpoint).

## 3. Notion Integration (Knowledge Base)
### API Scopes Required:
*   `read content`, `insert content`
### Document Generation Flow:
*   Trigger: "Export Workshop Summary"
*   Mapping: Canvas Clusters -> Notion Toggle Headings / Lists
*   Mapping: Decisions -> Notion Checklists or Call-outs.

## 4. Rate Limiting & Resilience
*   Retry mechanisms with exponential backoff for Miro/Notion SDKs.
*   Queuing system (e.g., BullMQ / RabbitMQ) for batch exports.

## 5. Error Handling & Recovery
*   What happens if Miro API is down during a workshop?
*   Failsafe: Local caching and delayed synchronization.
