import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase3_JobsToBeDone() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🔨 Jobs to be Done";

  const [jtbd, setJtbd] = useState({
    situation: '',
    motivation: '',
    expectedOutcome: '',
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setJtbd(artifact.data.jtbd || { situation: '', motivation: '', expectedOutcome: '' });
      }
    } else {
      setJtbd({ situation: '', motivation: '', expectedOutcome: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = jtbd.motivation ? `Job: ${jtbd.motivation.substring(0, 30)}...` : 'JTBD Draft';
    const id = saveArtifact(3, TOOL_NAME, title, { jtbd }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = jtbd.motivation ? `Job: ${jtbd.motivation.substring(0, 30)}...` : 'JTBD Draft';
    const id = saveArtifact(3, TOOL_NAME, title, { jtbd }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Jobs to be Done",
    blocks: [
      {
        type: 'key-value' as const,
        content: [
          { key: "1. Situation (When...)", value: jtbd.situation || t("Not specified") },
          { key: "2. Motivation (I want to...)", value: jtbd.motivation || t("Not specified") },
          { key: "3. Expected Outcome (So I can...)", value: jtbd.expectedOutcome || t("Not specified") }
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="🔨"
      title="Jobs to be Done"
      description="People don't buy products; they hire them to get a job done. Define the core need independent of any specific solution."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col h-full w-full max-w-4xl mx-auto justify-center gap-8">
        
        <div className="bg-muted-bg border border-border rounded-2xl p-8 shadow-sm flex flex-col gap-6">
           <h3 className="font-bold text-2xl text-foreground mb-2 flex items-center gap-3">
             <span className="bg-primary/20 text-primary w-10 h-10 rounded-full flex items-center justify-center text-lg">1</span>
             {t("Situation")} <span className="text-muted-fg font-normal text-lg">({t("When...")})</span>
           </h3>
           <textarea 
             rows={3} 
             placeholder={t("e.g. When I have 15 minutes between back-to-back meetings...")}
             value={jtbd.situation}
             onChange={e => setJtbd({...jtbd, situation: e.target.value})}
             className="w-full bg-background border border-border focus:border-primary rounded-xl p-4 text-base resize-none focus:outline-none"
           />
        </div>

        <div className="bg-muted-bg border border-border rounded-2xl p-8 shadow-sm flex flex-col gap-6">
           <h3 className="font-bold text-2xl text-foreground mb-2 flex items-center gap-3">
             <span className="bg-emerald-500/20 text-emerald-500 w-10 h-10 rounded-full flex items-center justify-center text-lg">2</span>
             {t("Motivation")} <span className="text-muted-fg font-normal text-lg">({t("I want to...")})</span>
           </h3>
           <textarea 
             rows={3} 
             placeholder={t("e.g. I want to quickly catch up on important messages without getting pulled into deep work...")}
             value={jtbd.motivation}
             onChange={e => setJtbd({...jtbd, motivation: e.target.value})}
             className="w-full bg-background border border-border focus:border-primary rounded-xl p-4 text-base resize-none focus:outline-none"
           />
        </div>

        <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-bl-[100%] -z-10 blur-xl" />
           <h3 className="font-bold text-2xl text-primary mb-2 flex items-center gap-3">
             <span className="bg-primary text-black w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm">3</span>
             {t("Expected Outcome")} <span className="text-primary/70 font-normal text-lg">({t("So I can...")})</span>
           </h3>
           <textarea 
             rows={3} 
             placeholder={t("e.g. So I can feel prepared and responsive before my next call starts.")}
             value={jtbd.expectedOutcome}
             onChange={e => setJtbd({...jtbd, expectedOutcome: e.target.value})}
             className="w-full bg-background border border-border focus:border-primary rounded-xl p-4 text-base resize-none focus:outline-none font-medium"
           />
        </div>

      </div>
    </ToolCanvas>
  );
}
