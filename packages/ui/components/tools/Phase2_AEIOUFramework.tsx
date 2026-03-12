import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase2_AEIOUFramework() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🏷️ AEIOU Framework";

  const [data, setData] = useState({
    A: '',
    E: '',
    I: '',
    O: '',
    U: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setData(artifact.data.data || { A: '', E: '', I: '', O: '', U: '' });
      }
    } else {
      setData({ A: '', E: '', I: '', O: '', U: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'AEIOU Framework Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { data }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'AEIOU Framework Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { data }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "AEIOU Framework",
    blocks: [
      {
        type: 'key-value' as const,
        content: [
          { key: "Activities (A)", value: data.A || t("Not specified") },
          { key: "Environments (E)", value: data.E || t("Not specified") },
          { key: "Interactions (I)", value: data.I || t("Not specified") },
          { key: "Objects (O)", value: data.O || t("Not specified") },
          { key: "Users (U)", value: data.U || t("Not specified") }
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="🏷️"
      title="AEIOU Framework"
      description="A structured log for field observations. Categorize what you see in the user's natural habitat into Activities, Environments, Interactions, Objects, and Users."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-6xl mx-auto h-[600px]">
        {/* Left Column */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
           <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2 border-b border-border pb-2">
                <div className="bg-primary/20 text-primary w-8 h-8 rounded flex items-center justify-center font-bold text-xl shrink-0">A</div>
                <h3 className="font-bold text-lg">{t("Activities")}</h3>
              </div>
              <p className="text-xs text-muted-fg mb-3 opacity-80">{t("Goal-directed sets of actions — sequences of behaviors that people do to accomplish a goal. What are they trying to do?")}</p>
              <textarea rows={5} value={data.A} onChange={e => setData({...data, A: e.target.value})} className="w-full h-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background" />
           </div>

           <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2 border-b border-border pb-2">
                <div className="bg-amber-500/20 text-amber-500 dark:text-amber-400 w-8 h-8 rounded flex items-center justify-center font-bold text-xl shrink-0">E</div>
                <h3 className="font-bold text-lg">{t("Environments")}</h3>
              </div>
              <p className="text-xs text-muted-fg mb-3 opacity-80">{t("The entire arena where activities take place. What is the character and function of the space?")}</p>
              <textarea rows={5} value={data.E} onChange={e => setData({...data, E: e.target.value})} className="w-full h-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background" />
           </div>
        </div>

        {/* Center Column */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
           <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex-1 flex flex-col border-t-4 border-t-primary/50">
              <div className="flex items-center gap-3 mb-2 border-b border-border pb-2">
                <div className="bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 w-8 h-8 rounded flex items-center justify-center font-bold text-xl shrink-0">I</div>
                <h3 className="font-bold text-lg">{t("Interactions")}</h3>
              </div>
              <p className="text-xs text-muted-fg mb-3 opacity-80">{t("The building blocks of activities. How are people interacting with the environment, objects, and each other? (Routine vs Special)")}</p>
              <textarea rows={10} value={data.I} onChange={e => setData({...data, I: e.target.value})} className="w-full h-full bg-primary/5 border border-primary/20 focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background font-medium" />
           </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
           <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2 border-b border-border pb-2">
                <div className="bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 w-8 h-8 rounded flex items-center justify-center font-bold text-xl shrink-0">O</div>
                <h3 className="font-bold text-lg">{t("Objects")}</h3>
              </div>
              <p className="text-xs text-muted-fg mb-3 opacity-80">{t("Building blocks of the environment, key elements sometimes put to complex/unintended uses. What devices or tools are present?")}</p>
              <textarea rows={5} value={data.O} onChange={e => setData({...data, O: e.target.value})} className="w-full h-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background" />
           </div>

           <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2 border-b border-border pb-2">
                <div className="bg-rose-500/20 text-rose-500 dark:text-rose-400 w-8 h-8 rounded flex items-center justify-center font-bold text-xl shrink-0">U</div>
                <h3 className="font-bold text-lg">{t("Users")}</h3>
              </div>
              <p className="text-xs text-muted-fg mb-3 opacity-80">{t("The people whose behaviors, preferences, and needs are being observed. Roles and relationships?")}</p>
              <textarea rows={5} value={data.U} onChange={e => setData({...data, U: e.target.value})} className="w-full h-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background" />
           </div>
        </div>

      </div>
    </ToolCanvas>
  );
}
