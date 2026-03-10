/**
 * MCP Integration barrel export.
 *
 * All MCP tool helpers are re-exported from here for convenient imports:
 *
 *   import { executeNotionCreateDatabase, executeGoogleCreateDraft } from "@/lib/mcp";
 */

export {
  // Notion
  executeNotionCreateDatabase,
  executeNotionAppendPageBlock,
  executeNotionCreatePage,
  // Google Workspace
  executeGoogleCreateEvent,
  executeGoogleCreateDraft,
  executeGoogleCreateDocument,
  // Miro
  executeMiroCreateStickyNote,
  executeMiroCreateShape,
  stageMiroArtifacts,
  // Types
  type McpToolResult,
} from "./client";
