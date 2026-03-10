"use client";

import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";
import { cn } from "../utils";
import { PanelRightClose, PanelRightOpen, MessageSquareText } from "lucide-react";

export function RightSidebar() {
  const { activeTab, isRightSidebarOpen, toggleRightSidebar } = usePhaseStore();

  if (activeTab === "Domo") return null;

  return (
    <div className={cn(
      "border-l border-border h-[calc(100vh-4rem)] bg-muted-bg flex flex-col transition-all duration-300 relative",
      isRightSidebarOpen ? "w-80" : "w-16"
    )}>
      <div className={cn(
        "flex items-center border-b border-border p-2",
        isRightSidebarOpen ? "justify-between" : "justify-center flex-col"
      )}>
        {isRightSidebarOpen && (
          <div className="px-2">
            <h3 className="font-bold text-sm whitespace-nowrap">Domo Copilot</h3>
            <p className="text-xs text-muted-fg whitespace-nowrap">Context: {activeTab}</p>
          </div>
        )}
        <button 
          onClick={toggleRightSidebar}
          className={cn(
            "p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-muted-fg hover:text-foreground transition-colors",
            !isRightSidebarOpen && "mb-2"
          )}
          aria-label={isRightSidebarOpen ? "Collapse Copilot" : "Expand Copilot"}
        >
          {isRightSidebarOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </button>
        {!isRightSidebarOpen && (
           <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-sm shadow-sm" title="Domo Copilot">🤖</div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Placeholder Chat Bubbles */}
        {isRightSidebarOpen ? (
          <div className="flex space-x-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 text-xs shadow-sm">🤖</div>
            <div className="bg-background border border-border rounded-lg p-3 text-sm shadow-sm">
              I'm monitoring your work in <span className="font-bold">{activeTab}</span>. Let me know if you need any insights related to Phase 1.
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button 
              className="p-2 rounded-full bg-background border border-border shadow-sm hover:bg-primary-dim transition-colors"
              onClick={toggleRightSidebar}
              title="Open Chat"
            >
              <MessageSquareText size={16} className="text-muted-fg" />
            </button>
          </div>
        )}
      </div>

      {isRightSidebarOpen && (
        <div className="p-4 border-t border-border">
          <input 
            type="text" 
            placeholder="Ask Domo..."
            className="w-full text-sm p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>
      )}
    </div>
  );
}
