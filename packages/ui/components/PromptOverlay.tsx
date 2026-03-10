"use client";

import { useState } from "react";
import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";
import { X, Wand2 } from "lucide-react";

export function PromptOverlay() {
  const { isPromptOverlayOpen, setPromptOverlayOpen, addToast } = usePhaseStore();
  const [demographic, setDemographic] = useState("");
  const [dataSource, setDataSource] = useState("Phase 1 Transcripts");

  if (!isPromptOverlayOpen) return null;

  const handleBuildPrompt = () => {
    // In the real app, this would inject text into the chat.
    // We'll mimic this with a toast and closing the overlay.
    addToast({
      title: "Prompt Built",
      description: `Drafting persona for ${demographic || '[Missing]'} using ${dataSource}`,
      type: "success"
    });
    setPromptOverlayOpen(false);
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
            onClick={() => setPromptOverlayOpen(false)}
            className="p-1 hover:bg-black/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-primary-dim p-4 rounded-lg border border-primary text-sm font-mono leading-relaxed">
            Draft a <strong className="text-urgent">User Persona</strong> for 
            <input 
              type="text" 
              placeholder="[Target Demographic]"
              value={demographic}
              onChange={(e) => setDemographic(e.target.value)}
              className="mx-2 bg-transparent border-b-2 border-urgent focus:outline-none focus:border-black dark:focus:border-white px-1 w-40 font-bold"
            />
            using the data from 
            <select 
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
              className="mx-2 bg-transparent border-b-2 border-info font-bold text-info focus:outline-none focus:border-black dark:focus:border-white w-48 cursor-pointer"
            >
              <option>Phase 1 Transcripts</option>
              <option>Phase 2 Empathy Maps</option>
              <option>All Prior Context</option>
            </select>.
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
