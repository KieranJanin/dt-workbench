import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

interface Step {
  id: number;
  title: string;
  doing: string;
  feeling: 'Positive' | 'Neutral' | 'Negative';
  painPoint: string;
}

export function Phase3_JourneyMap() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🛤️ Journey Map";

  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: 'Awareness', doing: '', feeling: 'Neutral', painPoint: '' },
    { id: 2, title: 'Engagement', doing: '', feeling: 'Neutral', painPoint: '' },
    { id: 3, title: 'Action', doing: '', feeling: 'Neutral', painPoint: '' },
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setSteps(artifact.data.steps || []);
      }
    } else {
      setSteps([
        { id: 1, title: 'Awareness', doing: '', feeling: 'Neutral', painPoint: '' },
        { id: 2, title: 'Engagement', doing: '', feeling: 'Neutral', painPoint: '' },
        { id: 3, title: 'Action', doing: '', feeling: 'Neutral', painPoint: '' },
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Journey Map Draft';
    const id = saveArtifact(3, TOOL_NAME, title, { steps }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Journey Map Draft';
    const id = saveArtifact(3, TOOL_NAME, title, { steps }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Journey Map",
    blocks: [
      {
        type: 'grid' as const,
        content: [
          ["Step", "Doing", "Emotion", "Pain Point / Opportunity"],
          ...steps.map((s, i) => [
            s.title || `Step ${i+1}`,
            s.doing || "-",
            s.feeling,
            s.painPoint || "-"
          ])
        ]
      }
    ]
  });

  const updateStep = (id: number, field: string, value: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addStep = () => {
    setSteps([...steps, { id: Date.now(), title: `Step ${steps.length + 1}`, doing: '', feeling: 'Neutral', painPoint: '' }]);
  };

  const getEmojiForFeeling = (feeling: string) => {
    if (feeling === 'Positive') return '😁';
    if (feeling === 'Negative') return '😫';
    return '😐';
  };

  return (
    <ToolCanvas
      emoji="🛤️"
      title="Journey Map"
      description="Visualize the process that a person goes through in order to accomplish a goal. Identify the friction points along the emotional rollercoaster."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col h-full w-full gap-8 overflow-x-auto pb-4">
        
        <div className="flex gap-4 min-w-[800px] h-full flex-1">
           {steps.map((step, index) => (
             <div key={step.id} className="flex-1 min-w-[300px] flex flex-col gap-4 relative">
                
                {/* Visual connecting line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-full h-1 bg-border -z-10" />
                )}

                {/* Step Header */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg z-10 shadow-md ring-4 ring-background">
                    {index + 1}
                  </div>
                  <input 
                    type="text" 
                    value={['Awareness', 'Engagement', 'Action'].includes(step.title) ? t(step.title) : step.title}
                    onChange={e => updateStep(step.id, 'title', e.target.value)}
                    className="w-full text-center bg-transparent font-bold text-xl focus:outline-none focus:text-primary border-b border-transparent focus:border-border"
                  />
                </div>

                {/* Doing */}
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex-1 flex flex-col">
                  <h4 className="text-xs font-bold text-muted-fg uppercase tracking-wider mb-2">{t("Doing")}</h4>
                  <textarea 
                    placeholder={t("What action are they taking?")}
                    value={step.doing}
                    onChange={e => updateStep(step.id, 'doing', e.target.value)}
                    className="w-full h-full bg-transparent resize-none focus:outline-none text-sm leading-relaxed"
                  />
                </div>

                {/* Feeling Curve (Simplified to dropdown for tool) */}
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col items-center gap-2">
                  <h4 className="text-xs font-bold text-muted-fg uppercase tracking-wider">{t("Emotion")}</h4>
                  <div className="flex items-center gap-2 w-full justify-center">
                    <span className="text-2xl">{getEmojiForFeeling(step.feeling)}</span>
                    <select 
                      value={step.feeling}
                      onChange={e => updateStep(step.id, 'feeling', e.target.value)}
                      className="bg-muted-bg border border-border rounded text-sm p-1 focus:outline-none focus:border-primary"
                    >
                      <option value="Positive">{t("Positive")}</option>
                      <option value="Neutral">{t("Neutral")}</option>
                      <option value="Negative">{t("Negative (Friction)")}</option>
                    </select>
                  </div>
                </div>

                {/* Pain Point */}
                <div className={`border rounded-xl p-4 shadow-sm flex-1 flex flex-col ${step.feeling === 'Negative' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-muted-bg border-border'}`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${step.feeling === 'Negative' ? 'text-rose-600 dark:text-rose-400' : 'text-muted-fg'}`}>
                    {t("Pain Point / Opportunity")}
                  </h4>
                  <textarea 
                    placeholder={t("Where is the friction? How can we fix it?")}
                    value={step.painPoint}
                    onChange={e => updateStep(step.id, 'painPoint', e.target.value)}
                    className="w-full h-full bg-transparent resize-none focus:outline-none text-sm font-medium leading-relaxed"
                  />
                </div>

             </div>
           ))}

           {/* Add Step Button */}
           <div className="shrink-0 w-[60px] flex items-center justify-center">
             <button 
               data-html2canvas-ignore="true"
               onClick={addStep}
               className="w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-fg hover:text-primary hover:border-primary transition-colors text-2xl"
             >
               +
             </button>
           </div>
        </div>

      </div>
    </ToolCanvas>
  );
}
