import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase3_HowMightWe() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "💡 How Might We";

  const [hmw, setHmw] = useState({
    user: '',
    need: '',
    insight: '',
    finalQuestion: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setHmw(artifact.data.hmw || { user: '', need: '', insight: '', finalQuestion: '' });
      }
    } else {
      setHmw({ user: '', need: '', insight: '', finalQuestion: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = hmw.finalQuestion ? `HMW: ${hmw.finalQuestion.substring(0, 30)}...` : 'HMW Draft';
    const id = saveArtifact(3, TOOL_NAME, title, { hmw }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = hmw.finalQuestion ? `HMW: ${hmw.finalQuestion.substring(0, 30)}...` : 'HMW Draft';
    const id = saveArtifact(3, TOOL_NAME, title, { hmw }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "How Might We",
    blocks: [
      {
        type: 'key-value' as const,
        content: [
          { key: "User", value: hmw.user || t("Not specified") },
          { key: "Need", value: hmw.need || t("Not specified") },
          { key: "Insight", value: hmw.insight || t("Not specified") }
        ]
      },
      { type: 'section_header' as const, content: "Generative Question" },
      { type: 'text' as const, content: `How Might We... ${hmw.finalQuestion || t("Not specified")}` }
    ]
  });

  return (
    <ToolCanvas
      emoji="💡"
      title="How Might We"
      description="Translate your point of view statement into an actionable, generative question that launches the ideation phase."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col h-full w-full max-w-4xl mx-auto justify-center gap-8">
        
        {/* POV Equation */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
           <div className="flex-1 bg-card border border-border rounded-xl p-5 shadow-sm">
             <h3 className="text-xs font-bold text-muted-fg uppercase tracking-wider mb-2">{t("[USER]")}</h3>
             <textarea rows={2} placeholder={t("e.g. The remote manager...")} value={hmw.user} onChange={e => setHmw({...hmw, user: e.target.value})} className="w-full bg-transparent resize-none focus:outline-none font-bold text-lg text-foreground" />
           </div>

           <div className="flex items-center justify-center text-muted-fg font-bold text-xl shrink-0">+</div>

           <div className="flex-1 bg-card border border-border rounded-xl p-5 shadow-sm">
             <h3 className="text-xs font-bold text-muted-fg uppercase tracking-wider mb-2">{t("[NEED]")}</h3>
             <textarea rows={2} placeholder={t("e.g. Requires a way to feel connected...")} value={hmw.need} onChange={e => setHmw({...hmw, need: e.target.value})} className="w-full bg-transparent resize-none focus:outline-none font-bold text-lg text-foreground" />
           </div>
           
           <div className="flex items-center justify-center text-muted-fg font-bold text-xl shrink-0">+</div>

           <div className="flex-1 bg-card border border-border rounded-xl p-5 shadow-sm">
             <h3 className="text-xs font-bold text-muted-fg uppercase tracking-wider mb-2">{t("[INSIGHT]")}</h3>
             <textarea rows={2} placeholder={t("e.g. Because scheduled calls feel fake.")} value={hmw.insight} onChange={e => setHmw({...hmw, insight: e.target.value})} className="w-full bg-transparent resize-none focus:outline-none font-bold text-lg text-foreground" />
           </div>
        </div>

        {/* The Generative Question */}
        <div className="relative mt-8">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-1 rounded-full text-sm font-bold border border-amber-500/30 flex items-center gap-2">
            <span>✨</span> {t("Generates")}
          </div>
          
          <div className="bg-primary/10 border-2 border-primary/40 rounded-3xl p-10 shadow-lg text-center flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 drop-shadow-sm">{t("How Might We...")}</h2>
            <textarea 
              rows={3} 
              placeholder={t("...create a serendipitous connection space for remote managers without adding more meetings to their calendar?")}
              value={hmw.finalQuestion} 
              onChange={e => setHmw({...hmw, finalQuestion: e.target.value})} 
              className="w-full max-w-3xl bg-background border border-border focus:border-primary rounded-xl p-6 text-2xl font-medium resize-none focus:outline-none text-center shadow-inner leading-relaxed" 
            />
            <p className="text-sm text-foreground my-4 mt-6 max-w-xl opacity-80 font-medium">
              {t("A good HMW is broad enough to allow for multiple creative solutions, but narrow enough to give the team actionable boundaries.")}
            </p>
          </div>
        </div>

      </div>
    </ToolCanvas>
  );
}
