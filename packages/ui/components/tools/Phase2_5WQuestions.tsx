import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase2_5WQuestions() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🧲 5W Questions";

  const [qs, setQs] = useState({
    who: '',
    what: '',
    where: '',
    when: '',
    why: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setQs(artifact.data.qs || { who: '', what: '', where: '', when: '', why: '' });
      }
    } else {
      setQs({ who: '', what: '', where: '', when: '', why: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = qs.who ? `5W: ${qs.who}` : '5W Questions Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { qs }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = qs.who ? `5W: ${qs.who}` : '5W Questions Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { qs }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "5W Questions",
    blocks: [
      {
        type: 'key-value' as const,
        content: [
          { key: "Who", value: qs.who || t("Not specified") },
          { key: "What", value: qs.what || t("Not specified") },
          { key: "Where", value: qs.where || t("Not specified") },
          { key: "When", value: qs.when || t("Not specified") },
          { key: "Why", value: qs.why || t("Not specified") }
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="🧲"
      title="5W Questions"
      description="Use structured observation to draw conclusions about motives. Answering these five questions clarifies exactly what behavior was observed."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
        
        <div className="bg-muted-bg border border-border rounded-xl p-6 flex flex-col gap-2">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-primary text-primary-foreground font-bold w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0">W1</div>
             <h3 className="font-bold text-xl">{t("Who?")}</h3>
           </div>
           <p className="text-sm text-muted-fg ml-15 pl-15">{t("Who is the subject? (Demographics, roles, defining characteristics)")}</p>
           <input type="text" value={qs.who} onChange={e => setQs({...qs, who: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary mt-2" />
        </div>

        <div className="bg-muted-bg border border-border rounded-xl p-6 flex flex-col gap-2">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-primary text-primary-foreground font-bold w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0">W2</div>
             <h3 className="font-bold text-xl">{t("What?")}</h3>
           </div>
           <p className="text-sm text-muted-fg ml-15 pl-15">{t("What exactly are they doing? (Observable actions only)")}</p>
           <textarea rows={2} value={qs.what} onChange={e => setQs({...qs, what: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary mt-2 resize-none" />
        </div>

        <div className="bg-muted-bg border border-border rounded-xl p-6 flex flex-col gap-2">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-primary text-primary-foreground font-bold w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0">W3</div>
             <h3 className="font-bold text-xl">{t("Where?")}</h3>
           </div>
           <p className="text-sm text-muted-fg ml-15 pl-15">{t("Where is the action taking place? (Context, environment, digital space)")}</p>
           <input type="text" value={qs.where} onChange={e => setQs({...qs, where: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary mt-2" />
        </div>

        <div className="bg-muted-bg border border-border rounded-xl p-6 flex flex-col gap-2">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-primary text-primary-foreground font-bold w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0">W4</div>
             <h3 className="font-bold text-xl">{t("When?")}</h3>
           </div>
           <p className="text-sm text-muted-fg ml-15 pl-15">{t("When does it occur? (Triggers, timeline, frequency)")}</p>
           <input type="text" value={qs.when} onChange={e => setQs({...qs, when: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary mt-2" />
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 flex flex-col gap-2 mt-4 relative overflow-hidden">
           <div className="absolute right-0 top-0 w-32 h-32 bg-primary/20 rounded-bl-[100px] -z-10" />
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-primary text-primary-foreground font-bold w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-md">W5</div>
             <h3 className="font-bold text-xl text-primary">{t("Why?")}</h3>
           </div>
           <p className="text-sm text-foreground mb-2">{t("Based on the above, why do we infer they are doing this? (The underlying motivation)")}</p>
           <textarea rows={3} value={qs.why} onChange={e => setQs({...qs, why: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary mt-1 resize-none z-10 font-medium" />
        </div>

      </div>
    </ToolCanvas>
  );
}
