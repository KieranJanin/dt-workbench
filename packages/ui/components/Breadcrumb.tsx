"use client";

import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";
import { cn } from "../utils";

const GATES = [
  {
    id: 0,
    name: "Prep work",
    phases: [
      { id: 0, name: "Alignment" }
    ]
  },
  {
    id: 1,
    name: "Inspiration",
    phases: [
      { id: 1, name: "Understand" },
      { id: 2, name: "Observe" },
      { id: 3, name: "Point of View" }
    ]
  },
  {
    id: 2,
    name: "Ideation",
    phases: [
      { id: 4, name: "Ideate" },
      { id: 5, name: "Prototype" },
      { id: 6, name: "Test" }
    ]
  },
  {
    id: 3,
    name: "Implementation",
    phases: [
      { id: 7, name: "Storytelling" },
      { id: 8, name: "Pilot" },
      { id: 9, name: "Business Model" }
    ]
  }
];

export function Breadcrumb() {
  const { activePhase, unlockedPhases, setActivePhase } = usePhaseStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 py-3 bg-muted-bg border-t border-border flex items-end justify-center px-4 z-50">
      <div className="flex items-end space-x-6 w-full max-w-7xl">
        {GATES.map((gate, gateIndex) => (
          <div key={gate.id} className={cn(
            "flex flex-col relative", 
            gate.id === 0 ? "flex-none w-32 mr-8" : "flex-1" // Make Phase 0 separate
          )}>
            
            <div className="flex items-center w-full space-x-1">
              {gate.phases.map((phase, phaseIndex) => {
                const isUnlocked = unlockedPhases.includes(phase.id) || phase.id === 0; // Phase 0 always unlocked
                const isActive = phase.id === activePhase;
                
                return (
                  <div key={phase.id} className="flex items-center flex-1">
                    <button
                      onClick={() => isUnlocked && setActivePhase(phase.id)}
                      className={cn(
                        "flex-1 text-xs px-2 py-2 rounded-sm transition-colors text-center truncate",
                        isActive 
                          ? "bg-primary text-foreground shadow-sm font-bold border border-primary-dim" 
                          : isUnlocked 
                            ? "bg-primary-dim text-foreground hover:bg-primary/50 cursor-pointer font-semibold" 
                            : "bg-background text-muted-fg cursor-not-allowed opacity-60 border border-border"
                      )}
                      disabled={!isUnlocked}
                      title={`Phase ${phase.id}: ${phase.name}`}
                    >
                      <div className="truncate">{phase.id}. {phase.name}</div>
                    </button>
                    {phaseIndex < gate.phases.length - 1 && (
                      <div className="w-2 h-0.5 bg-border mx-0.5 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Accolade / Bracket below the gate phases */}
            <div className="mt-1 flex flex-col items-center w-full">
              <div className="w-full h-2 border-b-2 border-x-2 border-border/60 rounded-b-md" />
              <div className="text-[10px] font-bold text-muted-fg uppercase tracking-widest mt-1">
                Gate {gate.id}: {gate.name}
              </div>
            </div>

            {/* Visual separator for Gate 0 */}
            {gate.id === 0 && (
              <div className="absolute -right-6 top-1/3 w-px h-8 bg-border shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
