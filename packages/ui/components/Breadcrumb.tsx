"use client";

import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";
import { cn } from "../utils";

const PHASES = [
  { id: 1, name: "Intake", gate: 0 },
  { id: 2, name: "Alignment", gate: 0 },
  { id: 3, name: "Empathy", gate: 1 },
  { id: 4, name: "Define", gate: 1 },
  { id: 5, name: "Ideate", gate: 1 },
  { id: 6, name: "Prototype", gate: 2 },
  { id: 7, name: "Test", gate: 2 },
  { id: 8, name: "Iterate", gate: 2 },
  { id: 9, name: "Refine", gate: 3 },
  { id: 10, name: "Handover", gate: 3 },
];

export function Breadcrumb() {
  const { activePhase, unlockedPhases, setActivePhase } = usePhaseStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-muted-bg border-t border-border flex items-center justify-center px-4 z-50">
      <div className="flex items-center space-x-2 w-full max-w-6xl">
        {PHASES.map((phase, index) => {
          const isUnlocked = unlockedPhases.includes(phase.id);
          const isActive = phase.id === activePhase;
          
          return (
            <div key={phase.id} className="flex items-center flex-1">
              <button
                onClick={() => isUnlocked && setActivePhase(phase.id)}
                className={cn(
                  "flex-1 text-xs font-semibold px-2 py-2 rounded-sm transition-colors text-center truncate",
                  isActive 
                    ? "bg-primary text-foreground shadow-sm font-bold" 
                    : isUnlocked 
                      ? "bg-primary-dim text-foreground hover:bg-primary/50 cursor-pointer" 
                      : "bg-muted-bg text-muted-fg cursor-not-allowed opacity-60 border border-border"
                )}
                disabled={!isUnlocked}
              >
                <div className="text-[10px] uppercase opacity-70 mb-0.5 tracking-wider">Gate {phase.gate}</div>
                <div>{phase.id}. {phase.name}</div>
              </button>
              {index < PHASES.length - 1 && (
                <div className="w-4 h-0.5 bg-border mx-1 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
