"use client";

import { X, SettingsIcon, Database, Folder, FileText, Map as MapIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils";
import { usePhaseStore } from "../../../apps/web/store/usePhaseStore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = usePhaseStore();
  const [activeTab, setActiveTab] = useState<'general' | 'integrations'>('general');

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

        {/* Tabs */}
        <div className="flex border-b border-border bg-background">
          <button
            onClick={() => setActiveTab('general')}
            className={cn(
              "flex-1 py-3 text-sm font-bold transition-colors border-b-2",
              activeTab === 'general' ? "border-primary text-primary" : "border-transparent text-muted-fg hover:text-foreground hover:bg-muted-bg"
            )}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={cn(
              "flex-1 py-3 text-sm font-bold transition-colors border-b-2",
              activeTab === 'integrations' ? "border-primary text-primary" : "border-transparent text-muted-fg hover:text-foreground hover:bg-muted-bg"
            )}
          >
            Integrations
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'general' && (
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
                  value={settings.projectName}
                  onChange={(e) => updateSettings({ projectName: e.target.value })}
                  className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Team Members
                </label>
                <input
                  type="text"
                  placeholder="Comma separated names..."
                  value={settings.teamMembers}
                  onChange={(e) => updateSettings({ teamMembers: e.target.value })}
                  className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Description & Goals
                </label>
                <textarea
                  value={settings.projectDescription}
                  onChange={(e) => updateSettings({ projectDescription: e.target.value })}
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
                    value={settings.targetAudience}
                    onChange={(e) => updateSettings({ targetAudience: e.target.value })}
                    className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Industry / Domain
                  </label>
                  <input
                    type="text"
                    value={settings.industry}
                    onChange={(e) => updateSettings({ industry: e.target.value })}
                    className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-fg uppercase tracking-wider">
                  External Integrations (BYOK)
                </h3>
                <p className="text-xs text-muted-fg leading-relaxed">
                  These keys are saved locally in your browser and used to authenticate the Domo Orchestrator.
                </p>

                <div className="space-y-4">
                  {/* Google */}
                  <div className="space-y-2 p-3 bg-muted-bg/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <Database size={16} className="text-blue-500" /> Google Cloud & Workspace
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-fg uppercase">GCP JSON Key (Base64)</label>
                        <input
                          type="password"
                          value={settings.gcpCredentials}
                          placeholder="Paste Service Account JSON"
                          onChange={(e) => updateSettings({ gcpCredentials: e.target.value })}
                          className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-xs"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-fg uppercase">Google Docs Publish URL</label>
                          <input
                            type="text"
                            value={settings.gdocsUrl}
                            placeholder="https://docs.google.com/document/d/e/.../pub"
                            onChange={(e) => updateSettings({ gdocsUrl: e.target.value })}
                            className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-fg uppercase">Calendar Embed URL</label>
                            <input
                              type="text"
                              value={settings.gcalendarUrl}
                              placeholder="https://calendar.google.com/..."
                              onChange={(e) => updateSettings({ gcalendarUrl: e.target.value })}
                              className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-muted-fg uppercase">Gmail URL</label>
                            <input
                              type="text"
                              value={settings.gmailUrl}
                              placeholder="https://mail.google.com/..."
                              onChange={(e) => updateSettings({ gmailUrl: e.target.value })}
                              className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notion */}
                  <div className="space-y-2 p-3 bg-muted-bg/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <FileText size={16} className="text-gray-500" /> Notion
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-fg uppercase">Internal Secret</label>
                        <input
                          type="password"
                          value={settings.notionKey}
                          placeholder="secret_..."
                          onChange={(e) => updateSettings({ notionKey: e.target.value })}
                          className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-fg uppercase">Root Page URL or ID</label>
                        <input
                          type="text"
                          value={settings.notionRootPageId}
                          placeholder="Paste URL or ID"
                          onChange={(e) => updateSettings({ notionRootPageId: e.target.value })}
                          className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Miro */}
                  <div className="space-y-2 p-4 bg-muted-bg/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <MapIcon size={16} className="text-yellow-600" /> Miro
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-fg uppercase">OAuth Token</label>
                        <input
                          type="password"
                          value={settings.miroToken}
                          placeholder="eyJ..."
                          onChange={(e) => updateSettings({ miroToken: e.target.value })}
                          className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-fg uppercase">Board ID or URL</label>
                        <input
                          type="text"
                          value={settings.miroBoardId}
                          placeholder="Paste URL or ID"
                          onChange={(e) => updateSettings({ miroBoardId: e.target.value })}
                          className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Neo4j */}
                  <div className="space-y-2 p-3 bg-muted-bg/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <Database size={16} className="text-emerald-500" /> Neo4j Graph
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-fg uppercase">AuraDB URI</label>
                      <input
                        type="text"
                        value={settings.neo4jUri}
                        placeholder="neo4j+s://..."
                        onChange={(e) => updateSettings({ neo4jUri: e.target.value })}
                        className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted-bg flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-muted-fg hover:text-foreground transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
