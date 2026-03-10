"use client";

import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";
import { cn } from "../utils";
import { Folder, FileText, Database, Map as MapIcon, Link } from "lucide-react";

export function LeftSidebar() {
  const { activePhase, setPromptOverlayOpen } = usePhaseStore();

  return (
    <div className="w-64 border-r border-border h-[calc(100vh-4rem)] bg-background flex flex-col pt-4 overflow-y-auto">
      <div className="px-4 mb-6">
        <button 
          className="w-full bg-urgent text-white font-bold py-3 px-4 rounded-md shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
        >
          <Database size={18} />
          <span>Artifact Dashboard</span>
        </button>
      </div>

      <div className="px-4">
        <h3 className="text-xs font-bold text-muted-fg uppercase tracking-wider mb-3">Phase {activePhase} Library</h3>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm font-semibold text-foreground px-2 py-1">
              <Folder size={16} className="mr-2 text-info" />
              <span>Maps & Personas</span>
            </div>
            <button 
              onClick={() => setPromptOverlayOpen(true)}
              className="w-full text-left pl-8 pr-2 py-1.5 text-sm text-foreground hover:bg-primary-dim rounded-md transition-colors flex items-center group cursor-pointer"
            >
              <MapIcon size={14} className="mr-2 opacity-50 group-hover:opacity-100" />
              Stakeholder Map
            </button>
            <button 
              onClick={() => setPromptOverlayOpen(true)}
              className="w-full text-left pl-8 pr-2 py-1.5 text-sm text-foreground hover:bg-primary-dim rounded-md transition-colors flex items-center group cursor-pointer"
            >
              <FileText size={14} className="mr-2 opacity-50 group-hover:opacity-100" />
              User Persona
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-sm font-semibold text-foreground px-2 py-1">
              <Folder size={16} className="mr-2 text-info" />
              <span>Raw Transcripts</span>
            </div>
            <a href="#" className="w-full text-left pl-8 pr-2 py-1.5 text-sm text-foreground hover:bg-muted-bg rounded-md transition-colors flex items-center group">
              <Link size={14} className="mr-2 opacity-50 text-success group-hover:opacity-100" />
              Interview 01 (Notion)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
