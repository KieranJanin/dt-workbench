/**
 * MCP Client – centralised hub for connecting to official MCP servers.
 *
 * Philosophy: "Push on Demand" – each helper function proxies a single MCP
 * tool execution to the relevant official server.  When real credentials /
 * server binaries are not available the helpers fall back to a deterministic
 * mock response so that the rest of the application can be developed and
 * tested in isolation.
 *
 * Track 5 scope only – no UI, no LLM orchestration, no DB schemas.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface McpToolResult {
  /** Whether the call succeeded (or was mocked). */
  ok: boolean;
  /** The raw content array returned by the MCP server (or mock). */
  content: Array<{ type: string; text: string }>;
  /** True when no real server was available and a mock was used. */
  mocked: boolean;
}

interface ServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Environment helpers
// ---------------------------------------------------------------------------

const NOTION_TOKEN = process.env.NOTION_API_TOKEN ?? "";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN ?? "";
const MIRO_TOKEN = process.env.MIRO_API_TOKEN ?? "";

// ---------------------------------------------------------------------------
// Server configurations
// ---------------------------------------------------------------------------

/**
 * Each entry describes how to spawn the official MCP server via stdio.
 * The user is expected to have the required npx packages available or
 * the env variables populated; if not, the helpers gracefully mock.
 */
const SERVER_CONFIGS: Record<string, ServerConfig> = {
  notion: {
    command: "npx",
    args: ["-y", "@notionhq/notion-mcp-server"],
    env: {
      OPENAPI_MCP_HEADERS: JSON.stringify({
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
      }),
    },
  },
  google: {
    command: "npx",
    args: ["-y", "@anthropic/google-workspace-mcp-server"],
    env: {
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REFRESH_TOKEN,
    },
  },
  miro: {
    command: "npx",
    args: ["-y", "@mirohq/miro-mcp-server"],
    env: {
      MIRO_API_TOKEN: MIRO_TOKEN,
    },
  },
};

// ---------------------------------------------------------------------------
// Client cache (lazy singleton per provider)
// ---------------------------------------------------------------------------

const clients: Map<string, Client> = new Map();

async function getClient(provider: string): Promise<Client | null> {
  if (clients.has(provider)) return clients.get(provider)!;

  const cfg = SERVER_CONFIGS[provider];
  if (!cfg) return null;

  try {
    const transport = new StdioClientTransport({
      command: cfg.command,
      args: cfg.args,
      env: { ...process.env, ...cfg.env } as Record<string, string>,
    });

    const client = new Client(
      { name: `dt-workbench-${provider}`, version: "0.1.0" },
      { capabilities: {} },
    );

    await client.connect(transport);
    clients.set(provider, client);
    return client;
  } catch (err) {
    console.warn(
      `[mcp/${provider}] Could not start official MCP server – falling back to mock.`,
      err,
    );
    return null;
  }
}

// ---------------------------------------------------------------------------
// Generic executor
// ---------------------------------------------------------------------------

async function executeTool(
  provider: string,
  toolName: string,
  args: Record<string, unknown>,
): Promise<McpToolResult> {
  const client = await getClient(provider);

  if (client) {
    try {
      const result = await client.callTool({ name: toolName, arguments: args });
      return {
        ok: true,
        content: (result.content ?? []) as Array<{ type: string; text: string }>,
        mocked: false,
      };
    } catch (err) {
      console.error(`[mcp/${provider}] Tool "${toolName}" failed:`, err);
      return {
        ok: false,
        content: [{ type: "text", text: String(err) }],
        mocked: false,
      };
    }
  }

  // ---------- Mock fallback ----------
  console.info(
    `[mcp/${provider}] MOCK executing tool "${toolName}" with args:`,
    JSON.stringify(args, null, 2),
  );

  return {
    ok: true,
    content: [
      {
        type: "text",
        text: JSON.stringify({
          mock: true,
          provider,
          tool: toolName,
          args,
          message: `Mock response for ${toolName}. Connect the official ${provider} MCP server and supply credentials to get real results.`,
        }),
      },
    ],
    mocked: true,
  };
}

// ---------------------------------------------------------------------------
// Notion helpers
// ---------------------------------------------------------------------------

/** Create an embedded Notion database under a parent page. */
export function executeNotionCreateDatabase(
  parentPageId: string,
  title: string,
  properties: Record<string, unknown>,
) {
  return executeTool("notion", "notion_create_database", {
    parent_page_id: parentPageId,
    title,
    properties,
  });
}

/** Append block content (text, headings, etc.) to a Notion page. */
export function executeNotionAppendPageBlock(
  pageId: string,
  children: Array<Record<string, unknown>>,
) {
  return executeTool("notion", "notion_append_block_children", {
    block_id: pageId,
    children,
  });
}

/** Create a rich page inside an existing Notion database. */
export function executeNotionCreatePage(
  databaseId: string,
  properties: Record<string, unknown>,
  children?: Array<Record<string, unknown>>,
) {
  return executeTool("notion", "notion_create_page", {
    database_id: databaseId,
    properties,
    ...(children ? { children } : {}),
  });
}

// ---------------------------------------------------------------------------
// Google Workspace helpers
// ---------------------------------------------------------------------------

/** Create a Google Calendar event. */
export function executeGoogleCreateEvent(
  calendarId: string,
  summary: string,
  start: string,
  end: string,
  attendees?: string[],
  description?: string,
) {
  return executeTool("google", "create_event", {
    calendar_id: calendarId,
    summary,
    start,
    end,
    ...(attendees ? { attendees } : {}),
    ...(description ? { description } : {}),
  });
}

/** Create a Gmail draft (never sends – human must press Send). */
export function executeGoogleCreateDraft(
  to: string[],
  subject: string,
  body: string,
) {
  return executeTool("google", "create_draft", {
    to,
    subject,
    body,
  });
}

/** Create a new Google Doc and inject initial content. */
export function executeGoogleCreateDocument(
  title: string,
  content?: string,
) {
  return executeTool("google", "create_document", {
    title,
    ...(content ? { content } : {}),
  });
}

// ---------------------------------------------------------------------------
// Miro helpers
// ---------------------------------------------------------------------------

/** Create sticky notes on a Miro board. */
export function executeMiroCreateStickyNote(
  boardId: string,
  content: string,
  position?: { x: number; y: number },
) {
  return executeTool("miro", "create_sticky_note", {
    board_id: boardId,
    content,
    ...(position ? { position } : {}),
  });
}

/** Create a shape on a Miro board. */
export function executeMiroCreateShape(
  boardId: string,
  shape: string,
  content: string,
  position?: { x: number; y: number },
  size?: { width: number; height: number },
) {
  return executeTool("miro", "create_shape", {
    board_id: boardId,
    shape,
    content,
    ...(position ? { position } : {}),
    ...(size ? { size } : {}),
  });
}

/**
 * Stage a batch of artifacts for the dt.workbench Miro iframe app.
 * This bundles several shapes/sticky-notes into a single payload that the
 * iframe app can present as a clickable list for manual placement.
 */
export function stageMiroArtifacts(
  boardId: string,
  artifacts: Array<{
    type: "sticky_note" | "shape";
    content: string;
    shape?: string;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
  }>,
): McpToolResult {
  // This is a client-side staging function – it simply returns the
  // structured payload that the Miro iframe will consume. No MCP server
  // call is needed here because the Web SDK handles rendering.
  return {
    ok: true,
    content: [
      {
        type: "text",
        text: JSON.stringify({ boardId, artifacts }),
      },
    ],
    mocked: false,
  };
}
