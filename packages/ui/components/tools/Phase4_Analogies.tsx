import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase4_Analogies() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🔄 Analogies";

  const [analogies, setAnalogies] = useState([
    { id: 1, trigger: 'How would Apple do it?', transfer: '' },
    { id: 2, trigger: 'How would a fast-food chain do it?', transfer: '' },
    { id: 3, trigger: 'How does nature solve this?', transfer: '' }
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setAnalogies(artifact.data.analogies || analogies);
      }
    } else {
      setAnalogies([
        { id: 1, trigger: 'How would Apple do it?', transfer: '' },
        { id: 2, trigger: 'How would a fast-food chain do it?', transfer: '' },
        { id: 3, trigger: 'How does nature solve this?', transfer: '' }
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Analogies Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { analogies }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Analogies Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { analogies }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Analogies",
    blocks: [
      {
        type: 'grid' as const,
        content: [
          ["Analogy / Trigger", "Knowledge Transfer to our Problem"],
          ...analogies.map(a => [a.trigger || t("Untitled"), a.transfer || t("-")])
        ]
      }
    ]
  });

  const updateAnalogy = (id: number, field: 'trigger' | 'transfer', val: string) => {
    setAnalogies(analogies.map(a => a.id === id ? { ...a, [field]: val } : a));
  };

  const addAnalogy = () => setAnalogies([...analogies, { id: Date.now(), trigger: '', transfer: '' }]);

  return (
    <ToolCanvas
      emoji="🔄"
      title="Analogies"
      description="Draw inspiration from unrelated industries or nature. See how others solved similar abstract problems."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full flex flex-col gap-6">
        <div className="grid grid-cols-[1fr_2fr] gap-4 px-4 hidden md:grid">
           <div className="text-xs font-bold text-muted-fg uppercase">{t("Analogy / Trigger")}</div>
           <div className="text-xs font-bold text-muted-fg uppercase">{t("Knowledge Transfer to our Problem")}</div>
        </div>
        
        {analogies.map(a => (
          <div key={a.id} className="flex flex-col md:flex-row gap-4 bg-muted-bg p-4 rounded-xl border border-border">
             <div className="flex-1 md:max-w-xs">
               <input 
                 className="w-full bg-background border border-border focus:border-primary rounded-lg p-3 text-sm font-bold focus:outline-none"
                 placeholder={t("Analogy (e.g. Disney...)")}
                 value={a.trigger}
                 onChange={(e) => updateAnalogy(a.id, 'trigger', e.target.value)}
               />
               <p className="text-[10px] text-muted-fg mt-2 px-1">{t("What core principle makes this successful in their context?")}</p>
             </div>
             
             <div className="flex-[2] flex items-center">
                <span className="hidden md:block text-muted-fg text-2xl mx-4">→</span>
                <textarea 
                  className="w-full bg-background border border-border focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none h-full min-h-[80px]"
                  placeholder={t("How can we apply that principle to our solution?")}
                  value={a.transfer}
                  onChange={(e) => updateAnalogy(a.id, 'transfer', e.target.value)}
                />
             </div>
          </div>
        ))}
        
        <button onClick={addAnalogy} className="w-full py-4 border-2 border-dashed border-border rounded-xl text-muted-fg font-bold hover:text-primary hover:border-primary transition-colors">
          + {t("Add Analogy")}
        </button>
      </div>
    </ToolCanvas>
  );
}
