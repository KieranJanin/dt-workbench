"use client";

import { X, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [formData, setFormData] = useState({
    projectName: "Unified dt.workbench MVP",
    projectDescription: "A platform for design thinking practitioners.",
    targetAudience: "UX Designers, PMs, Engineers",
    industry: "Software / SaaS",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted-bg">
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Project Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-muted-fg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-fg uppercase tracking-wider">
              General Information
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Description & Goals
              </label>
              <textarea
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                rows={3}
                className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-border">
             <h3 className="text-sm font-semibold text-muted-fg uppercase tracking-wider">
              Integrations (Track 5 Sync)
            </h3>
             <div className="p-4 bg-muted-bg border border-border rounded-lg flex justify-between items-center opacity-70">
                <div className="space-y-1">
                  <div className="font-semibold text-sm">Notion Workspace</div>
                  <div className="text-xs text-muted-fg">dt-workbench-workspace</div>
                </div>
                <div className="text-xs bg-success/20 text-success px-2 py-1 rounded font-semibold">Connected</div>
             </div>
             <div className="p-4 bg-muted-bg border border-border rounded-lg flex justify-between items-center opacity-70">
                <div className="space-y-1">
                  <div className="font-semibold text-sm">Miro Team</div>
                  <div className="text-xs text-muted-fg">Design Operations</div>
                </div>
                <div className="text-xs bg-success/20 text-success px-2 py-1 rounded font-semibold">Connected</div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted-bg flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-muted-fg hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Mock save logic
              onClose();
            }}
            className="px-4 py-2 text-sm font-bold bg-primary text-foreground rounded-lg shadow-sm hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
