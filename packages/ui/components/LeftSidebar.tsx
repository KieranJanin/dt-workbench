"use client";

import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";
import { cn } from "../utils";
import { Folder, FolderOpen, FileText, Database, Map as MapIcon, Link, PanelLeftClose, PanelLeftOpen, Settings, ChevronRight, ChevronDown, MonitorPlay, Video, ClipboardList, Calendar, Table } from "lucide-react";
import { useState } from "react";
import { SettingsModal } from "./SettingsModal";
import { ArtifactDashboardModal } from "./ArtifactDashboardModal";

// --- Artifact Data Structure based on PRD ---
type ToolType = 'Miro' | 'Notion' | 'GSlides' | 'GDrive' | 'GForms' | 'GDocs' | 'GCalendar' | 'GSheets';

type ArtifactDef = { name: string; tool: ToolType; url?: string };

const PHASE_ARTIFACTS: Record<number, ArtifactDef[]> = {
  0: [
    { name: "Team Charter & RACI Matrix", tool: "Notion" },
    { name: "Project Kickoff Event", tool: "GCalendar" },
    { name: "Project Kickoff Presentation", tool: "GSlides" },
    { name: "Project Kickoff Video", tool: "GDrive" },
    { name: "Project Kickoff Survey", tool: "GForms" },
    { name: "Initial Problem Statement Draft", tool: "GDocs" },
  ],
  1: [
    { name: "Initial Research", tool: "Notion" },
    { name: "Competitor Analysis Matrix", tool: "Notion" },
    { name: "Stakeholder Map", tool: "Miro" },
    { name: "Ecosystem Map / Value Chain", tool: "Miro" },
    { name: "Market Landscape Map", tool: "Miro" },
    { name: "Initial Research Presentation", tool: "GSlides" },
    { name: "Market Landscape Map Presentation", tool: "GSlides" },
    { name: "Initial Research Presentation Video", tool: "GDrive" },
    { name: "Market Landscape Map Presentation Video", tool: "GDrive" },
  ],
  2: [
    { name: "Empathy Map", tool: "Miro" },
    { name: "Highlight Reel/Quote Synthesis Board", tool: "Miro" },
    { name: "Raw Interview Transcripts", tool: "Notion" },
    { name: "Field Observations Logs", tool: "Notion" },
    { name: "Empathy Gathering Presentation", tool: "GSlides" },
    { name: "Empathy Gathering Presentation Video", tool: "GDrive" },
    { name: "Empathy Gathering Survey", tool: "GForms" },
    { name: "Empathy Gathering Event", tool: "GCalendar" },
  ],
  3: [
    { name: "Cross-Interview Clustering", tool: "Miro" },
    { name: "As-Is User Journey Map", tool: "Miro" },
    { name: "How Might We (HMW) Statements", tool: "Miro" },
    { name: "Insight Statements", tool: "Notion" },
    { name: "POV Statements", tool: "Notion" },
    { name: "Rich Persona Profiles", tool: "Notion" },
    { name: "Synthesis Presentation", tool: "GSlides" },
    { name: "Synthesis Presentation Video", tool: "GDrive" },
    { name: "Synthesis Presentation Survey", tool: "GForms" },
    { name: "Synthesis Event", tool: "GCalendar" },
  ],
  4: [
    { name: "Brainstorming Clusters / Crazy 8s", tool: "Miro" },
    { name: "Impact vs. Effort Matrix", tool: "Miro" },
    { name: "Concept Voting/Dot-Voting Grids", tool: "Miro" },
    { name: "Concept Synthesis Presentation", tool: "GSlides" },
    { name: "Concept Synthesis Presentation Video", tool: "GDrive" },
    { name: "Concept Synthesis Presentation Survey", tool: "GForms" },
  ],
  5: [
    { name: "Low-fidelity Wireframe / Templates", tool: "Miro" },
    { name: "Storyboard / Scenario Narratives", tool: "Miro" },
    { name: "To-Be User Journey Map", tool: "Miro" },
    { name: "To-Be User Journey Map Presentation", tool: "GSlides" },
    { name: "To-Be User Journey Map Video", tool: "GDrive" },
    { name: "To-Be User Journey Map Survey", tool: "GForms" },
  ],
  6: [
    { name: "Usability Testing Protocol & Scripts", tool: "Notion" },
    { name: "Feedback Capture Grid", tool: "Miro" },
    { name: "Validation Scorecard", tool: "GSheets" },
    { name: "Usability Testing Presentation", tool: "GSlides" },
    { name: "Usability Testing Video", tool: "GDrive" },
    { name: "Usability Testing Survey", tool: "GForms" },
  ],
  7: [
    { name: "Executive Strategy Brief", tool: "GDocs" },
    { name: "Pitch Deck Outline", tool: "GSlides" },
    { name: "Executive Review Presentation", tool: "GSlides" },
    { name: "Executive Review Video", tool: "GDrive" },
    { name: "Executive Review Survey", tool: "GForms" },
    { name: "Executive Review Meeting", tool: "GCalendar" },
  ],
  8: [
    { name: "PRD - Product Requirements Document", tool: "Notion" },
    { name: "Initial User Stories Epic Board", tool: "Notion" },
    { name: "Initial User Stories Presentation", tool: "GSlides" },
    { name: "Initial User Stories Video", tool: "GDrive" },
    { name: "Initial User Stories Survey", tool: "GForms" },
  ],
  9: [
    { name: "Business Model Canvas / Lean Canvas", tool: "Miro" },
    { name: "Value Proposition Canvas", tool: "Miro" },
    { name: "Business Model Presentation", tool: "GSlides" },
    { name: "Business Model Video", tool: "GDrive" },
    { name: "Business Model Survey", tool: "GForms" },
  ]
};

const TOOL_ICONS: Record<ToolType, React.ReactNode> = {
  Miro: <MapIcon size={14} className="opacity-70 group-hover:opacity-100 shrink-0 text-yellow-500" />,
  Notion: <FileText size={14} className="opacity-70 group-hover:opacity-100 shrink-0 text-gray-500 dark:text-gray-400" />,
  GSlides: <MonitorPlay size={14} className="opacity-70 group-hover:opacity-100 shrink-0 text-yellow-600" />,
  GDrive: <Video size={14} className="opacity-70 group-hover:opacity-100 shrink-0 text-blue-500" />,
  GForms: <ClipboardList size={14} className="opacity-70 group-hover:opacity-100 shrink-0 text-purple-500" />,
  GDocs: <FileText size={14} className="opacity-70 group-hover:opacity-100 shrink-0 text-blue-600" />,
  GCalendar: <Calendar size={14} className="opacity-70 group-hover:opacity-100 shrink-0 text-blue-400" />,
  GSheets: <Table size={14} className="opacity-70 group-hover:opacity-100 shrink-0 text-green-500" />,
};

const TOOL_ORDER: ToolType[] = ['Miro', 'Notion', 'GDocs', 'GSlides', 'GDrive', 'GForms', 'GCalendar', 'GSheets'];

// Component for Foldable Folder
function ToolFolder({ tool, artifacts, setPromptOverlayOpen, isSidebarOpen }: { 
  tool: string, 
  artifacts: ArtifactDef[], 
  setPromptOverlayOpen: (name: string | null) => void,
  isSidebarOpen: boolean
}) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isSidebarOpen) {
    return (
      <button 
        className="w-full flex justify-center py-2 hover:bg-muted-bg rounded-md"
        title={tool}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Folder size={18} className="text-info opacity-70" />
      </button>
    );
  }

  return (
    <div className="space-y-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full text-sm font-semibold text-foreground px-2 py-1.5 hover:bg-muted-bg rounded-md transition-colors group"
      >
        {isOpen ? (
          <FolderOpen size={16} className="mr-2 text-info shrink-0" />
        ) : (
          <Folder size={16} className="mr-2 text-info shrink-0" />
        )}
        <span className="whitespace-nowrap flex-1 text-left">{tool}</span>
        {isOpen ? (
          <ChevronDown size={14} className="opacity-50 group-hover:opacity-100" />
        ) : (
          <ChevronRight size={14} className="opacity-50 group-hover:opacity-100" />
        )}
      </button>
      
      {isOpen && (
        <div className="pl-6 space-y-0.5">
          {artifacts.map((artifact, idx) => (
            <button
              key={idx}
              onClick={() => setPromptOverlayOpen(artifact.name)}
              title={artifact.name}
              className="w-full text-left py-1.5 px-2 text-xs text-muted-fg hover:text-foreground hover:bg-primary-dim rounded-md transition-colors flex items-center group cursor-pointer overflow-hidden"
            >
              {TOOL_ICONS[artifact.tool]}
              <span className="ml-2 truncate">{artifact.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LeftSidebar() {
  const { activePhase, setPromptOverlayOpen, isLeftSidebarOpen, toggleLeftSidebar } = usePhaseStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Group current phase artifacts by tool
  const currentArtifacts = PHASE_ARTIFACTS[activePhase] || [];
  const groupedArtifacts: Record<string, ArtifactDef[]> = {};
  
  // Group logic (e.g., Notion files together, Miro together)
  currentArtifacts.forEach(art => {
    if (!groupedArtifacts[art.tool]) {
      groupedArtifacts[art.tool] = [];
    }
    groupedArtifacts[art.tool].push(art);
  });

  return (
    <div className={cn(
      "border-r border-border h-full bg-background flex flex-col overflow-y-auto transition-all duration-300 relative",
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
          onClick={() => setIsDashboardOpen(true)}
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
            {TOOL_ORDER.map(tool => {
              const artifactsForTool = groupedArtifacts[tool];
              if (!artifactsForTool || artifactsForTool.length === 0) return null;
              
              return (
                <ToolFolder 
                  key={tool} 
                  tool={tool} 
                  artifacts={artifactsForTool} 
                  setPromptOverlayOpen={setPromptOverlayOpen}
                  isSidebarOpen={isLeftSidebarOpen}
                />
              );
            })}
          </div>
      </div>

      {/* Spacer to push settings to bottom */}
      <div className="flex-1" />

      {/* Settings Button */}
      <div className={cn(
        "p-3 border-t border-border mt-auto",
        isLeftSidebarOpen ? "flex items-center" : "flex justify-center"
      )}>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={cn(
            "flex items-center text-muted-fg hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted-bg w-full",
            isLeftSidebarOpen ? "justify-start space-x-2" : "justify-center"
          )}
          title="Project Settings"
        >
          <Settings size={18} className="shrink-0" />
          {isLeftSidebarOpen && <span className="text-sm font-semibold truncate">Settings</span>}
        </button>
      </div>

      <ArtifactDashboardModal 
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
