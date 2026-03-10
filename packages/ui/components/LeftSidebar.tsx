"use client";

import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";
import { cn } from "../utils";
import { Folder, FileText, Database, Map as MapIcon, Link, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function LeftSidebar() {
  const { activePhase, setPromptOverlayOpen, isLeftSidebarOpen, toggleLeftSidebar } = usePhaseStore();

  return (
    <div className={cn(
      "border-r border-border h-[calc(100vh-4rem)] bg-background flex flex-col overflow-y-auto transition-all duration-300 relative",
      isLeftSidebarOpen ? "w-64" : "w-16"
    )}>
      {/* Toggle Button */}
      <div className={cn(
        "flex items-center p-2 mb-2",
        isLeftSidebarOpen ? "justify-end" : "justify-center"
      )}>
        <button 
          onClick={toggleLeftSidebar}
          className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-muted-fg hover:text-foreground transition-colors"
          aria-label={isLeftSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isLeftSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>

      <div className="px-3 mb-6 flex justify-center">
        <button 
          className={cn(
            "bg-urgent text-white font-bold rounded-md shadow-sm hover:opacity-90 transition-all flex items-center justify-center space-x-2 overflow-hidden",
            isLeftSidebarOpen ? "w-full py-3 px-4" : "w-10 h-10 p-0"
          )}
          title="Artifact Dashboard"
        >
          <Database size={18} className="shrink-0" />
          {isLeftSidebarOpen && <span className="whitespace-nowrap">Artifact Dashboard</span>}
        </button>
      </div>

      <div className="px-3">
        {isLeftSidebarOpen ? (
          <h3 className="text-xs font-bold text-muted-fg uppercase tracking-wider mb-3 px-1">Phase {activePhase} Library</h3>
        ) : (
          <div className="flex justify-center mb-3">
            <span className="text-[10px] font-bold text-muted-fg bg-muted-bg px-2 rounded-full">P{activePhase}</span>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-1">
            {isLeftSidebarOpen && (
              <div className="flex items-center text-sm font-semibold text-foreground px-2 py-1">
                <Folder size={16} className="mr-2 text-info shrink-0" />
                <span className="whitespace-nowrap">Maps & Personas</span>
              </div>
            )}
            <button 
              onClick={() => setPromptOverlayOpen(true)}
              title="Stakeholder Map"
              className={cn(
                "w-full text-left py-1.5 text-sm text-foreground hover:bg-primary-dim rounded-md transition-colors flex items-center group cursor-pointer overflow-hidden",
                isLeftSidebarOpen ? "pl-8 pr-2" : "justify-center px-0 h-10"
              )}
            >
              <MapIcon size={isLeftSidebarOpen ? 14 : 18} className={cn(
                "opacity-50 group-hover:opacity-100 shrink-0",
                isLeftSidebarOpen && "mr-2"
              )} />
              {isLeftSidebarOpen && <span className="whitespace-nowrap">Stakeholder Map</span>}
            </button>
            <button 
              onClick={() => setPromptOverlayOpen(true)}
              title="User Persona"
              className={cn(
                "w-full text-left py-1.5 text-sm text-foreground hover:bg-primary-dim rounded-md transition-colors flex items-center group cursor-pointer overflow-hidden",
                isLeftSidebarOpen ? "pl-8 pr-2" : "justify-center px-0 h-10"
              )}
            >
              <FileText size={isLeftSidebarOpen ? 14 : 18} className={cn(
                "opacity-50 group-hover:opacity-100 shrink-0",
                isLeftSidebarOpen && "mr-2"
              )} />
              {isLeftSidebarOpen && <span className="whitespace-nowrap">User Persona</span>}
            </button>
          </div>

          <div className="space-y-1">
            {isLeftSidebarOpen && (
              <div className="flex items-center text-sm font-semibold text-foreground px-2 py-1">
                <Folder size={16} className="mr-2 text-info shrink-0" />
                <span className="whitespace-nowrap">Raw Transcripts</span>
              </div>
            )}
            <a 
              href="#" 
              title="Interview 01 (Notion)"
              className={cn(
                "w-full text-left py-1.5 text-sm text-foreground hover:bg-muted-bg rounded-md transition-colors flex items-center group overflow-hidden",
                isLeftSidebarOpen ? "pl-8 pr-2" : "justify-center px-0 h-10"
              )}
            >
              <Link size={isLeftSidebarOpen ? 14 : 18} className={cn(
                "opacity-50 text-success group-hover:opacity-100 shrink-0",
                isLeftSidebarOpen && "mr-2"
              )} />
              {isLeftSidebarOpen && <span className="whitespace-nowrap">Interview 01 (Notion)</span>}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
