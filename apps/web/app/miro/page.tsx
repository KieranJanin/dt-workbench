"use client";

/**
 * dt.workbench – Miro iframe sidebar application.
 *
 * This page is designed to run **inside** a Miro board as an embedded iframe
 * app.  It loads the Miro Web SDK, displays staged artifacts (sticky notes /
 * shapes) as a clickable list, and renders them onto the Miro canvas when
 * the user clicks or drags them.
 *
 * Track 5 scope only – no Chat UI, no LLM prompts, no DB schemas.
 */

import React, { useCallback, useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ArtifactItem {
  id: string;
  type: "sticky_note" | "shape";
  label: string;
  content: string;
  shape?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  rendered: boolean;
}

// ---------------------------------------------------------------------------
// Mock staged artifacts (to be replaced by real payload from AI orchestrator)
// ---------------------------------------------------------------------------

const MOCK_ARTIFACTS: ArtifactItem[] = [
  {
    id: "art-1",
    type: "sticky_note",
    label: "🗺️ Stakeholder_Map_v1.1",
    content: "Key Stakeholder: Product Manager – owns roadmap priorities",
    rendered: false,
  },
  {
    id: "art-2",
    type: "sticky_note",
    label: "💡 Insight_Statement_01",
    content: "Users struggle with multi-step onboarding flows (Phase 2 finding)",
    rendered: false,
  },
  {
    id: "art-3",
    type: "shape",
    label: "🔷 Journey_Map_Start",
    content: "Awareness Stage",
    shape: "rectangle",
    size: { width: 200, height: 100 },
    rendered: false,
  },
  {
    id: "art-4",
    type: "shape",
    label: "🔶 Journey_Map_Mid",
    content: "Consideration Stage",
    shape: "rectangle",
    size: { width: 200, height: 100 },
    rendered: false,
  },
  {
    id: "art-5",
    type: "sticky_note",
    label: "📝 HMW_Statement_01",
    content: "How might we reduce onboarding time by 50%?",
    rendered: false,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MiroAppPage() {
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>(MOCK_ARTIFACTS);
  const [sdkReady, setSdkReady] = useState(false);
  const [status, setStatus] = useState<string>("Initialising Miro SDK…");

  // ---- Load the Miro Web SDK script ----
  useEffect(() => {
    // If already loaded (HMR / re-mount)
    if (typeof window !== "undefined" && (window as any).miro) {
      setSdkReady(true);
      setStatus("SDK ready");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://miro.com/app/static/sdk/v2/miro.js";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
      setStatus("SDK ready");
    };
    script.onerror = () => {
      setStatus("⚠️ Miro SDK failed to load – are you inside a Miro board?");
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // ---- Render a single artifact onto the Miro canvas ----
  const renderArtifact = useCallback(
    async (artifact: ArtifactItem) => {
      const miro = (window as any).miro;

      if (!miro?.board) {
        setStatus("⚠️ Miro board API not available. Open this page inside a Miro board.");
        return;
      }

      try {
        if (artifact.type === "sticky_note") {
          await miro.board.createStickyNote({
            content: artifact.content,
            ...(artifact.position ? { x: artifact.position.x, y: artifact.position.y } : {}),
          });
        } else {
          await miro.board.createShape({
            content: artifact.content,
            shape: artifact.shape ?? "rectangle",
            width: artifact.size?.width ?? 200,
            height: artifact.size?.height ?? 100,
            ...(artifact.position ? { x: artifact.position.x, y: artifact.position.y } : {}),
          });
        }

        setArtifacts((prev) =>
          prev.map((a) => (a.id === artifact.id ? { ...a, rendered: true } : a)),
        );
        setStatus(`✅ Rendered "${artifact.label}" to canvas`);
      } catch (err) {
        console.error("[dt.workbench] Render error:", err);
        setStatus(`❌ Error rendering "${artifact.label}": ${String(err)}`);
      }
    },
    [],
  );

  // ---- Render all remaining artifacts ----
  const renderAll = useCallback(async () => {
    const pending = artifacts.filter((a) => !a.rendered);
    for (const art of pending) {
      await renderArtifact(art);
    }
  }, [artifacts, renderArtifact]);

  // ---- UI ----
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>dt.workbench</h1>
        <p style={styles.subtitle}>Staged Artifacts</p>
      </header>

      {/* Status bar */}
      <div style={styles.statusBar}>{status}</div>

      {/* Artifact list */}
      <ul style={styles.list}>
        {artifacts.map((art) => (
          <li
            key={art.id}
            style={{
              ...styles.listItem,
              opacity: art.rendered ? 0.5 : 1,
              cursor: art.rendered ? "default" : "pointer",
            }}
            onClick={() => !art.rendered && renderArtifact(art)}
            title={art.rendered ? "Already rendered" : "Click to render on canvas"}
          >
            <span style={styles.label}>{art.label}</span>
            <span style={styles.badge}>
              {art.rendered ? "✓" : art.type === "sticky_note" ? "Sticky" : "Shape"}
            </span>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          style={{
            ...styles.button,
            opacity: sdkReady ? 1 : 0.5,
          }}
          disabled={!sdkReady}
          onClick={renderAll}
        >
          Render All to Canvas
        </button>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <small>
          Powered by{" "}
          <strong>Miro Web SDK</strong> &amp; MCP
        </small>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline styles (no Tailwind dependency; runs inside Miro iframe)
// ---------------------------------------------------------------------------

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
    color: "#e0e0e0",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    paddingBottom: "8px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "12px",
  },
  title: {
    fontSize: "18px",
    fontWeight: 700,
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  subtitle: {
    fontSize: "12px",
    color: "#888",
    margin: "4px 0 0",
  },
  statusBar: {
    fontSize: "11px",
    color: "#aaa",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "6px",
    padding: "6px 10px",
    marginBottom: "12px",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    flex: 1,
    overflowY: "auto",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    marginBottom: "6px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.06)",
    transition: "background 0.2s, transform 0.1s",
  },
  label: {
    fontSize: "13px",
    fontWeight: 500,
  },
  badge: {
    fontSize: "10px",
    textTransform: "uppercase",
    color: "#667eea",
    fontWeight: 600,
  },
  actions: {
    marginTop: "12px",
    display: "flex",
    gap: "8px",
  },
  button: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  footer: {
    textAlign: "center",
    marginTop: "16px",
    color: "#555",
    fontSize: "11px",
  },
};
