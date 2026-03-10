"use client";

import { X, Database, Search, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "../utils";

interface ArtifactDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArtifactDashboardModal({ isOpen, onClose }: ArtifactDashboardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted-bg/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-urgent text-white rounded-lg shadow-sm">
              <Database size={20} />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-lg">Central Artifact Dashboard</h2>
              <p className="text-xs text-muted-fg">Monitor all generated assets and manually trigger Domo synthesis audits.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-muted-fg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 border-b border-border flex items-center space-x-4 bg-muted-bg/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
            <input 
              type="text" 
              placeholder="Search artifacts..." 
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>
          <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary">
            <option>All Phases</option>
            <option>Gate 0: Prep</option>
            <option>Gate 1: Inspiration</option>
          </select>
          <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary">
            <option>All Statuses</option>
            <option>Draft</option>
            <option>Audited</option>
            <option>Locked</option>
          </select>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted-bg/50 sticky top-0 z-10 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold text-muted-fg">Artifact Name</th>
                <th className="px-4 py-3 font-semibold text-muted-fg">Phase</th>
                <th className="px-4 py-3 font-semibold text-muted-fg">Location</th>
                <th className="px-4 py-3 font-semibold text-muted-fg">Status</th>
                <th className="px-4 py-3 font-semibold text-muted-fg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Mock Row 1 */}
              <tr className="hover:bg-muted-bg/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-gray-400 shrink-0" />
                    <span className="font-medium text-foreground">Stakeholder Map v1.2</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-fg">Phase 1 (Understand)</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                    Miro Canvas
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1.5 text-success">
                    <CheckCircle2 size={14} />
                    <span className="text-xs font-medium">Audited</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-semibold px-2 py-1 rounded bg-muted-bg text-muted-fg hover:text-foreground transition-colors border border-border shadow-sm">
                    View Version History
                  </button>
                </td>
              </tr>
              
              {/* Mock Row 2 */}
              <tr className="hover:bg-muted-bg/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-gray-400 shrink-0" />
                    <span className="font-medium text-foreground">Raw Field Transcripts (12)</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-fg">Phase 2 (Observe)</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
                    Notion DB
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    Gathering
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => {
                        alert("Triggering Domo RAG Audit. (MVP Simulation: generating synthetic contradiction report...)");
                    }}
                    className="text-xs font-bold px-3 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    Run Domo Audit
                  </button>
                </td>
              </tr>

               {/* Mock Row 3 */}
               <tr className="hover:bg-muted-bg/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-gray-400 shrink-0" />
                    <span className="font-medium text-foreground">Initial Problem Statement</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-fg">Phase 0 (Alignment)</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600/10 text-blue-600 border border-blue-600/20">
                    Google Docs
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1.5 text-muted-fg">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-fg"></span>
                    <span className="text-xs font-medium">Locked (Gate Passed)</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-semibold px-2 py-1 rounded bg-muted-bg text-muted-fg hover:text-foreground transition-colors border border-border shadow-sm">
                    View Version History
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
