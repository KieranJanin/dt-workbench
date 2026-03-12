import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase1_ContextMapping() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🌍 Context Mapping";

  const [context, setContext] = useState({
    user: '',
    who: '',
    what: '',
    when: '',
    where: '',
    why: '',
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setContext(artifact.data.context || { user: '', who: '', what: '', when: '', where: '', why: '' });
      }
    } else {
      setContext({ user: '', who: '', what: '', when: '', where: '', why: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = context.user ? `Context map: ${context.user}` : 'Context Map Draft';
    const id = saveArtifact(1, TOOL_NAME, title, { context }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = context.user ? `Context map: ${context.user}` : 'Context Map Draft';
    const id = saveArtifact(1, TOOL_NAME, title, { context }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Context Mapping",
    blocks: [
      { type: 'section_header' as const, content: "Target Scenario" },
      { type: 'text' as const, content: context.user || t("Not specified") },
      { type: 'section_header' as const, content: "Context Map" },
      {
        type: 'key-value' as const,
        content: [
          { key: "Who (Actors Involved)", value: context.who || t("Not specified") },
          { key: "What (Artifacts & Objects)", value: context.what || t("Not specified") },
          { key: "When (Time Context)", value: context.when || t("Not specified") },
          { key: "Where (Environment)", value: context.where || t("Not specified") },
          { key: "Why (Motivations & Triggers)", value: context.why || t("Not specified") }
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="🌍"
      title="Context Mapping"
      description="Analyze the larger picture: How do others experience these situations? Knowledge is information with additional context. This tool helps create that awareness."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
         <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex flex-col items-center text-center gap-3">
            <h3 className="font-bold text-lg text-primary">{t("Target Scenario")}</h3>
            <input 
              type="text" 
              placeholder={t("e.g. A user trying to book a last-minute flight...")} 
              value={context.user}
              onChange={e => setContext({...context, user: e.target.value})}
              className="bg-background border border-border w-full max-w-lg rounded-lg px-4 py-2 font-medium focus:outline-none focus:border-primary text-center"
            />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
               <div className="flex items-center gap-2 mb-3">
                 <span className="bg-blue-500/10 text-blue-500 font-bold px-2 py-1 rounded text-xs uppercase tracking-wider">{t("Who")}</span>
                 <h4 className="font-bold">{t("Actors Involved")}</h4>
               </div>
               <textarea 
                 rows={3} 
                 placeholder={t("Who else is present? Who influences them?")} 
                 value={context.who}
                 onChange={e => setContext({...context, who: e.target.value})}
                 className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background transition-colors"
               />
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
               <div className="flex items-center gap-2 mb-3">
                 <span className="bg-emerald-500/10 text-emerald-500 font-bold px-2 py-1 rounded text-xs uppercase tracking-wider">{t("What")}</span>
                 <h4 className="font-bold">{t("Artifacts & Objects")}</h4>
               </div>
               <textarea 
                 rows={3} 
                 placeholder={t("What tools, systems, or objects are they using?")} 
                 value={context.what}
                 onChange={e => setContext({...context, what: e.target.value})}
                 className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background transition-colors"
               />
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
               <div className="flex items-center gap-2 mb-3">
                 <span className="bg-amber-500/10 text-amber-500 font-bold px-2 py-1 rounded text-xs uppercase tracking-wider">{t("When")}</span>
                 <h4 className="font-bold">{t("Time Context")}</h4>
               </div>
               <textarea 
                 rows={3} 
                 placeholder={t("When does this happen? Is there time pressure?")} 
                 value={context.when}
                 onChange={e => setContext({...context, when: e.target.value})}
                 className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background transition-colors"
               />
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
               <div className="flex items-center gap-2 mb-3">
                 <span className="bg-indigo-500/10 text-indigo-500 font-bold px-2 py-1 rounded text-xs uppercase tracking-wider">{t("Where")}</span>
                 <h4 className="font-bold">{t("Environment")}</h4>
               </div>
               <textarea 
                 rows={3} 
                 placeholder={t("Where does this take place? What is the physical space like?")} 
                 value={context.where}
                 onChange={e => setContext({...context, where: e.target.value})}
                 className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background transition-colors"
               />
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm lg:col-span-2">
               <div className="flex items-center gap-2 mb-3">
                 <span className="bg-rose-500/10 text-rose-500 font-bold px-2 py-1 rounded text-xs uppercase tracking-wider">{t("Why")}</span>
                 <h4 className="font-bold">{t("Motivations & Triggers")}</h4>
               </div>
               <textarea 
                 rows={3} 
                 placeholder={t("Why are they doing this? What is the trigger that caused this scenario to unfold?")} 
                 value={context.why}
                 onChange={e => setContext({...context, why: e.target.value})}
                 className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background transition-colors"
               />
            </div>
         </div>
      </div>
    </ToolCanvas>
  );
}
