"use client";

import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";
import { cn } from "../utils";
import { CheckCircle2, Circle, PanelLeftClose, PanelLeftOpen, Settings, Database } from "lucide-react";
import { useState } from "react";
import { SettingsModal } from "./SettingsModal";
import { ArtifactDashboardModal } from "./ArtifactDashboardModal";

export function LeftSidebar() {
  const { activePhase, isLeftSidebarOpen, toggleLeftSidebar, phaseTasks, toggleTaskCompletion } = usePhaseStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Get current tasks and calculate progress
  const tasks = phaseTasks[activePhase] || [];
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

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

      {/* Checklist Area */}
      <div className="px-3">
        {isLeftSidebarOpen ? (
          <div className="mb-4 px-1">
            <h3 className="text-xs font-bold text-muted-fg uppercase tracking-wider mb-2">Phase {activePhase} Tasks</h3>
            <div className="h-1.5 w-full bg-muted-bg rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5">
              <span className="text-[10px] text-muted-fg">Domo Sync Active</span>
              <span className="text-[10px] font-semibold text-foreground">{completedCount}/{tasks.length}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <span className="text-[10px] font-bold text-muted-fg bg-muted-bg px-2 rounded-full">P{activePhase}</span>
          </div>
        )}
        
        <div className="space-y-1">
          {tasks.map(task => (
            <button
              key={task.id}
              onClick={() => toggleTaskCompletion(activePhase, task.id)}
              className={cn(
                "w-full text-left py-2.5 px-3 text-xs rounded-md transition-colors flex items-start group cursor-pointer",
                isLeftSidebarOpen ? "justify-start" : "justify-center px-0",
                task.completed ? "text-muted-fg hover:bg-muted-bg" : "text-foreground hover:bg-primary-dim"
              )}
              title={task.title}
            >
              <div className="shrink-0 mt-0.5">
                {task.completed ? (
                  <CheckCircle2 size={16} className="text-success" />
                ) : (
                  <Circle size={16} className="text-muted-fg group-hover:text-primary transition-colors" />
                )}
              </div>
              {isLeftSidebarOpen && (
                <span className={cn(
                  "ml-3 leading-snug",
                  task.completed && "line-through opacity-70"
                )}>
                  {task.title}
                </span>
              )}
            </button>
          ))}
          
          {tasks.length === 0 && isLeftSidebarOpen && (
            <div className="text-center py-6 border border-dashed border-border rounded-lg mt-4">
              <p className="text-xs text-muted-fg">No tasks defined.</p>
              <p className="text-[10px] text-muted-fg mt-1">Chat with Domo to add tasks.</p>
            </div>
          )}
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
