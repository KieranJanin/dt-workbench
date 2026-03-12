import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase2_AnalysisBuilder() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🧩 Analysis Builder";

  const [questions, setQuestions] = useState([
    { id: 1, type: 'Descriptive', q: 'What actually happened during the observation?' },
    { id: 2, type: 'Inferential', q: 'What does this behavior suggest about their underlying beliefs?' },
    { id: 3, type: 'Evaluative', q: 'How effective was their current workaround?' },
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setQuestions(artifact.data.questions || []);
      }
    } else {
      setQuestions([
        { id: 1, type: 'Descriptive', q: 'What actually happened during the observation?' },
        { id: 2, type: 'Inferential', q: 'What does this behavior suggest about their underlying beliefs?' },
        { id: 3, type: 'Evaluative', q: 'How effective was their current workaround?' },
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Analysis Builder Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { questions }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Analysis Builder Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { questions }, null);
    setActiveArtifactId(id);
  };

  const updateQ = (id: number, field: string, value: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const addQ = () => {
    setQuestions([...questions, { id: Date.now(), type: 'Custom', q: '' }]);
  };

  const getExportData = () => ({
    title: "Analysis Builder",
    blocks: [
      { type: 'section_header' as const, content: "Diagnostic Questions" },
      {
        type: 'grid' as const,
        content: [
          ["Type", "Question"],
          ...questions.filter(q => q.q).map(q => [q.type, q.q])
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="🧩"
      title="Analysis-Fragen-Builder"
      description="Build targeted, analytical questions to process the raw data and observations collected in the field before moving to synthesis."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-4">
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {t('The Analysis Builder helps the team transition from "What did we see?" to "What does it mean?".')} 
            <br/>{t("Use these structured question frames to interrogate your observation data systematically.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {questions.map((q, idx) => (
             <div key={q.id} className="bg-card border border-border rounded-xl p-5 shadow-sm group">
                 <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-muted-fg bg-muted-bg px-2 py-1 rounded">{t("Q.")}{idx + 1}</span>
                  <input 
                    type="text" 
                    value={
                      ['Descriptive', 'Inferential', 'Evaluative', 'Custom'].includes(q.type) ? t(q.type) : q.type
                    } 
                    onChange={e => updateQ(q.id, 'type', e.target.value)}
                    className="bg-transparent border-none focus:ring-1 focus:ring-primary rounded px-1 text-xs font-bold uppercase tracking-wider text-primary w-full"
                  />
                </div>
                <textarea 
                  rows={4} 
                  placeholder={t("Draft your analysis question here...")}
                  value={
                    ['What actually happened during the observation?', 'What does this behavior suggest about their underlying beliefs?', 'How effective was their current workaround?'].includes(q.q) ? t(q.q) : q.q
                  } 
                  onChange={e => updateQ(q.id, 'q', e.target.value)} 
                  className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background text-foreground font-semibold leading-relaxed" 
                />
             </div>
           ))}

           <div className="bg-transparent border-2 border-dashed border-border rounded-xl flex items-center justify-center p-5 min-h-[160px]">
             <button 
               data-html2canvas-ignore="true"
               onClick={addQ}
               className="px-6 py-3 font-bold text-muted-fg hover:text-primary transition-colors flex items-center justify-center gap-2"
             >
               {t("+ Construct New Question")}
             </button>
           </div>
        </div>
      </div>
    </ToolCanvas>
  );
}
