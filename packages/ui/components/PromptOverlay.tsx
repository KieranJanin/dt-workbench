"use client";

import { useState } from "react";
import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";
import { X, Wand2 } from "lucide-react";

export function PromptOverlay() {
  const { activePromptArtifact, setPromptOverlayOpen, addToast, activePhase } = usePhaseStore();
  const [demographic, setDemographic] = useState("");
  const [dataSource, setDataSource] = useState(`Phase ${Math.max(0, activePhase - 1)} Context`);

  if (!activePromptArtifact) return null;

  const handleBuildPrompt = () => {
    // In the real app, this would inject text into the chat.
    addToast({
      title: "Prompt Sent to Domo",
      description: `Requested generation of ${activePromptArtifact}`,
      type: "success"
    });
    setPromptOverlayOpen(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border bg-muted-bg">
          <div className="flex items-center space-x-2">
            <Wand2 className="text-urgent" size={20} />
            <h2 className="font-bold text-lg">Build Artifact Prompt</h2>
          </div>
          <button 
            onClick={() => setPromptOverlayOpen(null)}
            className="p-1 hover:bg-black/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-sm text-muted-fg bg-muted-bg p-3 border border-border rounded-md">
            You are drafting a generative AI prompt for <strong className="text-foreground">{activePromptArtifact}</strong>. Fill in the missing context parameters below.
          </div>
          <div className="bg-primary-dim p-4 rounded-lg border border-primary text-[15px] font-mono leading-relaxed shadow-sm">
            <span className="opacity-70">@Domo, please synthesize a new </span>
            <strong className="text-urgent">{activePromptArtifact}</strong>
            <span className="opacity-70"> focusing primarily on </span>
            <input 
              type="text" 
              placeholder="[Target Focus / Demographic]"
              value={demographic}
              onChange={(e) => setDemographic(e.target.value)}
              className="mx-1 bg-transparent border-b-2 border-urgent text-urgent focus:outline-none focus:border-black dark:focus:border-white px-1 w-48 font-bold placeholder:text-urgent/40 placeholder:font-normal"
            />
            <span className="opacity-70">. Use the data and insights gathered from </span>
            <select 
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
              className="mx-1 bg-transparent border-b-2 border-info font-bold text-info focus:outline-none focus:border-black dark:focus:border-white w-48 cursor-pointer"
            >
              <option>Phase {Math.max(0, activePhase - 1)} Context</option>
              <option>Raw Field Transcripts</option>
              <option>All Prior Database Context</option>
              <option>Market Landscape Research</option>
            </select>
            <span className="opacity-70"> as your absolute source of truth. Highlight any contradictions you find against our initial assumptions.</span>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-muted-bg">
          <button 
            onClick={handleBuildPrompt}
            className="bg-black dark:bg-white text-white dark:text-black font-bold py-2 px-6 rounded-md hover:opacity-90 transition-opacity"
          >
            Insert Prompt
          </button>
        </div>
      </div>
    </div>
  );
}
