import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase6_ExperienceTesting() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🧪 Experience Testing";

  const [experience, setExperience] = useState({
    before: '',
    during: '',
    after: '',
    emotionalCurve: 'neutral'
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setExperience(artifact.data.experience || experience);
      }
    } else {
      setExperience({ before: '', during: '', after: '', emotionalCurve: 'neutral' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Experience Testing Draft';
    const id = saveArtifact(6, TOOL_NAME, title, { experience }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Experience Testing Draft';
    const id = saveArtifact(6, TOOL_NAME, title, { experience }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => {
    return {
      title: "Experience Testing",
      blocks: [
        {
          type: 'key-value' as const,
          content: [
            { key: "Overall Emotional Curve", value: experience.emotionalCurve }
          ]
        },
        { type: 'text' as const, title: "Before Experience (Anticipation)", content: experience.before || t("-") },
        { type: 'text' as const, title: "During Experience (Interaction)", content: experience.during || t("-") },
        { type: 'text' as const, title: "After Experience (Reflection)", content: experience.after || t("-") }
      ]
    };
  };

  return (
    <ToolCanvas
      emoji="🧪"
      title="Experience Testing"
      description="Focus on the holistic feeling of the solution. Do not just look at usability; evaluate emotion before, during, and after use."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center justify-between">
           <div>
             <h3 className="text-lg font-bold">{t("Overall Emotional Assessment")}</h3>
             <p className="text-xs text-muted-fg">{t("How did the user ultimately feel about the experience?")}</p>
           </div>
           <select 
             className="p-3 bg-muted-bg border border-border rounded-lg focus:outline-none focus:border-primary text-2xl"
             value={experience.emotionalCurve}
             onChange={(e) => setExperience({...experience, emotionalCurve: e.target.value})}
           >
             <option value="delighted">🤩 Delighted</option>
             <option value="satisfied">🙂 Satisfied</option>
             <option value="neutral">😐 Neutral</option>
             <option value="confused">🤔 Confused</option>
             <option value="frustrated">😤 Frustrated</option>
           </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-muted-bg/50 border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-muted-fg mb-4">{t("1. Before (Anticipation)")}</h3>
            <textarea 
              className="w-full h-40 bg-background border border-border focus:border-primary rounded-lg p-3 resize-none text-sm focus:outline-none"
              placeholder={t("What were their expectations before using it? Were they excited, anxious, confused?")}
              value={experience.before}
              onChange={(e) => setExperience({...experience, before: e.target.value})}
            />
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-primary mb-4">{t("2. During (Interaction)")}</h3>
            <textarea 
              className="w-full h-40 bg-background border border-border focus:border-primary rounded-lg p-3 resize-none text-sm focus:outline-none"
              placeholder={t("What emotions spiked while they interacted? When did they smile or frown?")}
              value={experience.during}
              onChange={(e) => setExperience({...experience, during: e.target.value})}
            />
          </div>

          <div className="bg-muted-bg/50 border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-muted-fg mb-4">{t("3. After (Reflection)")}</h3>
            <textarea 
              className="w-full h-40 bg-background border border-border focus:border-primary rounded-lg p-3 resize-none text-sm focus:outline-none"
              placeholder={t("How did they feel once they finished? What was the lasting impression?")}
              value={experience.after}
              onChange={(e) => setExperience({...experience, after: e.target.value})}
            />
          </div>
        </div>

      </div>
    </ToolCanvas>
  );
}
