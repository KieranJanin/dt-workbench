import React, { useState, MouseEvent, KeyboardEvent } from 'react';
import { usePhaseStore } from '../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../lib/i18n';
import { FileText, Clock, Archive, Trash2, Edit2, Check, X, Pin, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../utils';

export function DashboardOverview() {
  const { activePhase, language, artifacts, setActiveArtifactId, setActiveTab, toggleArchiveArtifact, deleteArtifact, renameArtifact } = usePhaseStore();
  const { t } = useTranslation(language);
  const [showArchived, setShowArchived] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Filter artifacts for the current phase
  const phaseArtifacts = artifacts.filter(a => a.phase === activePhase);
  const activeArtifacts = phaseArtifacts.filter(a => !a.isArchived && !a.isPinned).sort((a, b) => b.updatedAt - a.updatedAt);
  const pinnedArtifacts = phaseArtifacts.filter(a => !a.isArchived && a.isPinned).sort((a, b) => b.updatedAt - a.updatedAt);
  const archivedArtifacts = phaseArtifacts.filter(a => a.isArchived).sort((a, b) => b.updatedAt - a.updatedAt);

  const handleOpenArtifact = (id: string, toolName: string) => {
    // Only open if we aren't editing the title
    if (!editingId) {
      setActiveArtifactId(id);
      setActiveTab(toolName);
    }
  };

  const handleStartEdit = (e: MouseEvent, artifact: any) => {
    e.stopPropagation();
    setEditingId(artifact.id);
    setEditValue(artifact.customTitle || artifact.title || '');
  };

  const handleSaveEdit = (e: MouseEvent | KeyboardEvent, id: string) => {
    e.stopPropagation();
    if (editValue.trim() !== '') {
      renameArtifact(id, editValue.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground mb-2">
              {t("Phase Overview")} - {t("Phase")} {activePhase}
            </h2>
            <p className="text-muted-fg text-lg max-w-2xl">
              {t("Manage and review all your generated artifacts for this phase.")}
            </p>
          </div>
          
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-colors shadow-sm self-start">
            <Sparkles size={20} className="text-indigo-200" />
            {t("Synthesize Phase Insights")}
          </button>
        </div>

        {/* Pinned Artifacts / Key Takeaways */}
        {pinnedArtifacts.length > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 dark:bg-amber-500/10">
            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-500 mb-4 flex items-center gap-2">
              <Pin size={24} className="fill-amber-600/20" />
              {t("Key Takeaways (Pinned)")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedArtifacts.map((artifact) => (
                <ArtifactCard 
                  key={artifact.id} 
                  artifact={artifact} 
                  t={t} 
                  formatDate={formatDate} 
                  editingId={editingId} 
                  editValue={editValue} 
                  setEditValue={setEditValue} 
                  handleOpenArtifact={handleOpenArtifact} 
                  handleStartEdit={handleStartEdit} 
                  handleSaveEdit={handleSaveEdit} 
                  handleCancelEdit={handleCancelEdit} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Artifacts Grid */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="text-primary" size={24} />
            {t("Recent Artifacts")}
          </h3>
          
          {activeArtifacts.length === 0 && pinnedArtifacts.length === 0 ? (
            <div className="bg-muted-bg border border-dashed border-border rounded-xl p-12 text-center text-muted-fg">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">{t("No artifacts created yet.")}</p>
              <p className="text-sm mt-2">{t("Select a tool from the tabs above to create your first artifact.")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeArtifacts.map((artifact) => (
                <ArtifactCard 
                  key={artifact.id} 
                  artifact={artifact} 
                  t={t} 
                  formatDate={formatDate} 
                  editingId={editingId} 
                  editValue={editValue} 
                  setEditValue={setEditValue} 
                  handleOpenArtifact={handleOpenArtifact} 
                  handleStartEdit={handleStartEdit} 
                  handleSaveEdit={handleSaveEdit} 
                  handleCancelEdit={handleCancelEdit} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Recommended Next Tool */}
        {phaseArtifacts.length > 0 && (
          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6">
             <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <ArrowRight className="text-primary" size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-foreground mb-1">{t("Recommended Next Action")}</h3>
                   <p className="text-muted-fg mb-4">
                     {t("Based on your recent activity, here are the most logical next steps to advance your design process.")}
                   </p>
                   <div className="flex gap-3">
                      {/* Temporary hardcoded suggestions, this could be dynamic later */}
                      <button className="bg-background border border-border hover:border-primary px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm">
                        {activePhase === 0 ? "🗺️ " + t("Stakeholder Map") : 
                         activePhase === 1 ? "❓ " + t("5x Why") :
                         activePhase === 2 ? "🎤 " + t("Empathy Interview") : 
                         activePhase === 3 ? "🧠 " + t("Empathy Map") :
                         activePhase === 4 ? "🔲 " + t("2x2 Matrix") :
                         activePhase === 5 ? "⚙️ " + t("Service Blueprint") :
                         "📋 " + t("Testing Sheet")}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Archived Artifacts Section */}
        {archivedArtifacts.length > 0 && (
          <div className="pt-8 border-t border-border">
            <button 
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center gap-2 text-muted-fg hover:text-foreground transition-colors font-medium text-lg"
            >
              <Archive size={20} />
              {t("Archived Artifacts")} ({archivedArtifacts.length})
            </button>
            
            {showArchived && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {archivedArtifacts.map((artifact) => (
                  <div 
                    key={artifact.id}
                    className="bg-muted-bg border border-border rounded-xl p-5 opacity-75 hover:opacity-100 transition-opacity flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4 h-14">
                      <div className="flex-1 min-w-0 pr-2">
                        {editingId === artifact.id ? (
                          <div className="flex items-center gap-2 mb-1" onClick={e => e.stopPropagation()}>
                            <input 
                              type="text" 
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveEdit(e, artifact.id);
                                if (e.key === 'Escape') handleCancelEdit(e);
                              }}
                              autoFocus
                              className="bg-background border border-border focus:border-primary rounded px-2 py-1 text-sm font-bold w-full"
                            />
                            <button onClick={(e) => handleSaveEdit(e, artifact.id)} className="text-green-500 hover:text-green-600 transition-colors">
                              <Check size={16} />
                            </button>
                            <button onClick={handleCancelEdit} className="text-muted-fg hover:text-foreground transition-colors">
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="group/title flex items-center justify-between h-[28px]">
                            <h4 className="font-bold text-foreground truncate text-lg pr-2">
                              {artifact.customTitle || artifact.title || t("Untitled Document")}
                            </h4>
                            <button 
                              onClick={(e) => handleStartEdit(e, artifact)} 
                              className="opacity-0 group-hover/title:opacity-100 p-1 text-muted-fg hover:text-primary transition-opacity focus:opacity-100 shrink-0"
                              title={t("Rename")}
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                        <p className="text-xs text-muted-fg mt-1 truncate">{t(artifact.toolName)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-fg">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {formatDate(artifact.updatedAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleArchiveArtifact(artifact.id)}
                          className="px-2 py-1 bg-background hover:bg-border rounded text-foreground transition-colors font-medium"
                        >
                          {t("Restore")}
                        </button>
                        <button 
                          onClick={() => deleteArtifact(artifact.id)}
                          className="p-1.5 hover:bg-red-500/10 rounded-md text-muted-fg hover:text-red-500 transition-colors"
                          title={t("Delete")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// Subcomponent to render exactly the same card logic for pinned and unpinned to avoid massive duplication
function ArtifactCard({ artifact, t, formatDate, editingId, editValue, setEditValue, handleOpenArtifact, handleStartEdit, handleSaveEdit, handleCancelEdit }: any) {
  const { toggleArchiveArtifact, deleteArtifact, togglePinArtifact } = usePhaseStore();
  
  return (
    <div 
      className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col cursor-pointer relative"
      onClick={() => handleOpenArtifact(artifact.id, artifact.toolName)}
    >
      {artifact.isPinned && (
        <div className="absolute top-0 right-0 p-2 text-amber-500 rounded-bl-xl bg-amber-500/10 border-b border-l border-amber-500/20">
          <Pin size={16} className="fill-amber-500" />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4 h-14">
        <div className="flex-1 min-w-0 pr-2">
          {editingId === artifact.id ? (
            <div className="flex items-center gap-2 mb-1" onClick={e => e.stopPropagation()}>
              <input 
                type="text" 
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveEdit(e, artifact.id);
                  if (e.key === 'Escape') handleCancelEdit(e);
                }}
                autoFocus
                className="bg-background border border-border focus:border-primary rounded px-2 py-1 text-sm font-bold w-full"
              />
              <button onClick={(e) => handleSaveEdit(e, artifact.id)} className="text-green-500 hover:text-green-600 transition-colors">
                <Check size={16} />
              </button>
              <button onClick={handleCancelEdit} className="text-muted-fg hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="group/title flex items-center justify-between h-[28px] pr-4">
              <h4 className="font-bold text-foreground truncate text-lg group-hover:text-primary transition-colors pr-2">
                {artifact.customTitle || artifact.title || t("Untitled Document")}
              </h4>
              <button 
                onClick={(e) => handleStartEdit(e, artifact)} 
                className="opacity-0 group-hover/title:opacity-100 p-1 text-muted-fg hover:text-primary transition-opacity focus:opacity-100 shrink-0"
                title={t("Rename")}
              >
                <Edit2 size={14} />
              </button>
            </div>
          )}
          <p className="text-xs text-primary font-medium mt-1 truncate pr-4">{t(artifact.toolName)}</p>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-fg">
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          {formatDate(artifact.updatedAt)}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => togglePinArtifact(artifact.id)}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              artifact.isPinned ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" : "hover:bg-muted-bg text-muted-fg hover:text-foreground"
            )}
            title={artifact.isPinned ? t("Unpin") : t("Pin")}
          >
            <Pin size={16} className={artifact.isPinned ? "fill-amber-500" : ""} />
          </button>
          <button 
            onClick={() => toggleArchiveArtifact(artifact.id)}
            className="p-1.5 hover:bg-muted-bg rounded-md text-muted-fg hover:text-foreground transition-colors"
            title={t("Archive")}
          >
            <Archive size={16} />
          </button>
          <button 
            onClick={() => deleteArtifact(artifact.id)}
            className="p-1.5 hover:bg-red-500/10 rounded-md text-muted-fg hover:text-red-500 transition-colors"
            title={t("Delete")}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
