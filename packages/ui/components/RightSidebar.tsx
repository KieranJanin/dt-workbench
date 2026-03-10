"use client";

import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";

export function RightSidebar() {
  const { activeTab } = usePhaseStore();

  if (activeTab === "Domo") return null;

  return (
    <div className="w-80 border-l border-border h-[calc(100vh-4rem)] bg-muted-bg flex flex-col pt-4">
      <div className="px-4 pb-2 border-b border-border">
        <h3 className="font-bold text-sm">Domo Copilot</h3>
        <p className="text-xs text-muted-fg">Context: {activeTab}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Placeholder Chat Bubbles */}
        <div className="flex space-x-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 text-xs">🤖</div>
          <div className="bg-background border border-border rounded-lg p-2 text-sm shadow-sm">
            I'm monitoring your work in {activeTab}. Let me know if you need any insights related to Phase 1.
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <input 
          type="text" 
          placeholder="Ask Domo..."
          className="w-full text-sm p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
