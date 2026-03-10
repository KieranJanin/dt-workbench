"use client";
import { DomoChat } from "../components/domo/DomoChat";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      {/* Pretend this is the Right Sidebar or Main Viewport */}
      <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-8 relative">
        <h1 className="text-2xl font-bold text-gray-400">Main Content Area (Tab Viewport)</h1>
        
        {/* Mock Artifact Dashboard for Testing */}
        <div className="absolute top-8 left-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200 w-80">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Artifact Dashboard</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
              <span className="text-sm font-medium">Phase 2 Transcripts</span>
              <button 
                onClick={() => alert("Audit triggered via dashboard! Next iteration will route this to Domo.")}
                className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 cursor-pointer"
              >
                Audit
              </button>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
              <span className="text-sm font-medium">Stakeholder Map v1.2</span>
              <button 
                onClick={() => alert("Audit triggered via dashboard!")}
                className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 cursor-pointer"
              >
                Audit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[400px] h-screen shadow-xl border-l border-gray-200">
        <DomoChat />
      </div>
    </main>
  );
}
