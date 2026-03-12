import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase0_DesignPrinciples() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🧭 Design Principles";

  const [principles, setPrinciples] = useState([
    { id: 1, title: '', description: '' },
    { id: 2, title: '', description: '' },
    { id: 3, title: '', description: '' }
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setPrinciples(artifact.data.principles || []);
      }
    } else {
      setPrinciples([{ id: 1, title: '', description: '' }, { id: 2, title: '', description: '' }, { id: 3, title: '', description: '' }]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = principles[0]?.title ? principles[0].title.substring(0, 30) : 'Design Principles Draft';
    const id = saveArtifact(0, TOOL_NAME, title, { principles }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = principles[0]?.title ? principles[0].title.substring(0, 30) : 'Design Principles Draft';
    const id = saveArtifact(0, TOOL_NAME, title, { principles }, null);
    setActiveArtifactId(id);
  };

  const updatePrinciple = (id: number, field: 'title' | 'description', value: string) => {
    setPrinciples(principles.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addPrinciple = () => {
    if (principles.length < 6) {
      setPrinciples([...principles, { id: Date.now(), title: '', description: '' }]);
    }
  };

  const getExportData = () => ({
    title: "Design Principles",
    blocks: principles.map(p => ({
      type: 'text' as const,
      title: p.title || t("Untitled Principle"),
      content: p.description || t("No description provided.")
    }))
  });

  return (
    <ToolCanvas
      emoji="🧭"
      title="Design Principles"
      description="Define the overarching characteristics and mindsets that should be treated with high priority. Provide guidance so that decisions can be made more quickly within the design team."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((principle, idx) => (
            <div key={principle.id} className="bg-muted-bg p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary text-black font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  placeholder={t("e.g., User First, Always")}
                  value={principle.title}
                  onChange={(e) => updatePrinciple(principle.id, 'title', e.target.value)}
                  className="bg-background border border-border rounded-lg px-3 py-2 w-full font-bold focus:outline-none focus:border-primary"
                />
              </div>
              <textarea
                placeholder={t("Explain what this means in practice and how it guides decision-making...")}
                value={principle.description}
                onChange={(e) => updatePrinciple(principle.id, 'description', e.target.value)}
                rows={3}
                className="bg-background border border-border rounded-lg px-3 py-2 w-full resize-none text-sm focus:outline-none focus:border-primary"
              />
            </div>
          ))}
        </div>
        
        {principles.length < 6 && (
          <button 
            data-html2canvas-ignore="true"
            onClick={addPrinciple}
            className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-fg font-semibold hover:border-primary hover:text-primary transition-colors inline-block"
          >
            {t("+ Add Another Principle")}
          </button>
        )}
      </div>
    </ToolCanvas>
  );
}
