import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase5_DefineMVP() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "💎 Define MVP";

  const [features, setFeatures] = useState([
    { id: 1, text: '', status: 'in' },
    { id: 2, text: '', status: 'out' }
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setFeatures(artifact.data.features || features);
      }
    } else {
      setFeatures([
        { id: 1, text: '', status: 'in' },
        { id: 2, text: '', status: 'out' }
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Define MVP Draft';
    const id = saveArtifact(5, TOOL_NAME, title, { features }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Define MVP Draft';
    const id = saveArtifact(5, TOOL_NAME, title, { features }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => {
    const inScope = features.filter(f => f.status === 'in');
    const outScope = features.filter(f => f.status === 'out');
    
    return {
      title: "Minimum Viable Product Definition",
      blocks: [
        {
          type: 'list' as const,
          title: "In Scope (MVP)",
          content: inScope.length > 0 ? inScope.map(f => f.text || t("Untitled Feature")) : [t("None")]
        },
        {
          type: 'list' as const,
          title: "Out of Scope (V2+)",
          content: outScope.length > 0 ? outScope.map(f => f.text || t("Untitled Feature")) : [t("None")]
        }
      ]
    };
  };

  const updateFeature = (id: number, text: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, text } : f));
  };
  
  const moveFeature = (id: number, status: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, status } : f));
  };

  const addFeature = (status: string) => {
    setFeatures([...features, { id: Date.now(), text: '', status }]);
  };

  return (
    <ToolCanvas
      emoji="💎"
      title="Define MVP"
      description="Ruthlessly prioritize features to define the Minimum Viable Product. Separate the 'Must Haves' from the 'Nice to Haves'."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* IN SCOPE */}
        <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 rounded-2xl p-6 flex flex-col h-full shadow-sm">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{t("In Scope (MVP)")}</h3>
             <span className="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold px-3 py-1 rounded-full">{features.filter(f => f.status === 'in').length} Items</span>
           </div>
           
           <div className="flex-1 flex flex-col gap-3">
             {features.filter(f => f.status === 'in').map(f => (
               <div key={f.id} className="flex items-center gap-3 bg-white dark:bg-black border border-emerald-100 dark:border-emerald-800 rounded-lg p-2 shadow-sm group">
                  <button data-html2canvas-ignore="true" onClick={() => moveFeature(f.id, 'out')} className="opacity-0 group-hover:opacity-100 p-2 text-muted-fg hover:text-rose-500 transition-opacity" title="Move Out of Scope">→</button>
                  <input 
                    className="flex-1 bg-transparent focus:outline-none text-sm font-medium"
                    placeholder={t("Feature description...")}
                    value={f.text}
                    onChange={(e) => updateFeature(f.id, e.target.value)}
                  />
               </div>
             ))}
             <button onClick={() => addFeature('in')} className="w-full py-3 mt-2 border-2 border-dashed border-emerald-300 dark:border-emerald-800 rounded-lg text-emerald-600 dark:text-emerald-500 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
               + {t("Add Feature")}
             </button>
           </div>
        </div>

        {/* OUT OF SCOPE */}
        <div className="bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900 rounded-2xl p-6 flex flex-col h-full shadow-sm">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold text-rose-700 dark:text-rose-400">{t("Out of Scope (V2+)")}</h3>
             <span className="bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold px-3 py-1 rounded-full">{features.filter(f => f.status === 'out').length} Items</span>
           </div>
           
           <div className="flex-1 flex flex-col gap-3">
             {features.filter(f => f.status === 'out').map(f => (
               <div key={f.id} className="flex items-center gap-3 bg-white dark:bg-black border border-rose-100 dark:border-rose-800 rounded-lg p-2 shadow-sm group">
                  <button data-html2canvas-ignore="true" onClick={() => moveFeature(f.id, 'in')} className="opacity-0 group-hover:opacity-100 p-2 text-muted-fg hover:text-emerald-500 transition-opacity" title="Move In Scope">←</button>
                  <input 
                    className="flex-1 bg-transparent focus:outline-none text-sm font-medium"
                    placeholder={t("Feature description...")}
                    value={f.text}
                    onChange={(e) => updateFeature(f.id, e.target.value)}
                  />
               </div>
             ))}
             <button onClick={() => addFeature('out')} className="w-full py-3 mt-2 border-2 border-dashed border-rose-300 dark:border-rose-800 rounded-lg text-rose-600 dark:text-rose-500 font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors">
               + {t("Add Feature")}
             </button>
           </div>
        </div>

      </div>
    </ToolCanvas>
  );
}
