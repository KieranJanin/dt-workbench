"use client";

import { usePhaseStore, TabType } from "../../../apps/web/store/usePhaseStore";
import { cn } from "../utils";
import { ThemeToggle } from "./ThemeToggle";

const TABS: TabType[] = ["Domo", "Miro", "Notion", "GDocs", "GCalendar", "Gmail"];

export function MainViewport() {
  const { activeTab, setActiveTab } = usePhaseStore();

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-2 border-b border-border bg-muted-bg pt-2 h-12">
        <div className="flex items-center space-x-1 h-full">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-t-md transition-colors h-full",
                activeTab === tab
                  ? "bg-background text-foreground border-x border-t border-border"
                  : "bg-transparent text-muted-fg hover:text-foreground border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center pb-2 pr-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Viewport Content */}
      <div className="flex-1 overflow-y-auto relative bg-background">
        {activeTab === "Domo" ? (
          <div className="p-8 max-w-4xl mx-auto flex flex-col h-full">
            <div className="flex-1 space-y-6">
              <div className="text-center text-muted-fg mt-12 mb-8">
                <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-2xl shadow-sm">👻</div>
                <h2 className="text-xl font-bold text-foreground">Domo AI Reasoner</h2>
                <p>Track 6 will build out this chat orchestrator. Mock data for now.</p>
              </div>
              
              {/* Mock Chat Bubble */}
              <div className="bg-primary-dim p-4 rounded-xl max-w-2xl border border-primary shadow-sm inline-block">
                <p className="font-semibold mb-2">I am ready to synthesize your findings.</p>
                <div className="bg-background p-3 rounded-md text-sm border border-border shadow-sm">
                  <span className="bg-warning font-mono text-xs px-1 rounded-sm">Observation:</span> The user needs a stakeholder map.
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask Domo a question or generate an artifact..." 
                  className="flex-1 p-3 rounded-lg border border-border bg-background focus:outline-none focus:border-primary shadow-sm"
                />
                <button className="bg-primary text-black font-bold px-6 py-3 rounded-lg shadow-sm hover:opacity-90">
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted-bg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-muted-fg mb-2">{activeTab} Integration</h2>
              <p className="text-sm text-muted-fg">Track 5 will build the actual iframe/API connections.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
