import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase6_SolutionInterview() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🗨️ Solution Interview";

  const [questions, setQuestions] = useState([
    { id: 1, question: 'Does this solve the problem we discussed initially?', answer: '' },
    { id: 2, question: 'What would prevent you from using this?', answer: '' },
    { id: 3, question: 'How much would you pay for this?', answer: '' }
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setQuestions(artifact.data.questions || questions);
      }
    } else {
      setQuestions([
        { id: 1, question: 'Does this solve the problem we discussed initially?', answer: '' },
        { id: 2, question: 'What would prevent you from using this?', answer: '' },
        { id: 3, question: 'How much would you pay for this?', answer: '' }
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Solution Interview Draft';
    const id = saveArtifact(6, TOOL_NAME, title, { questions }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Solution Interview Draft';
    const id = saveArtifact(6, TOOL_NAME, title, { questions }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Solution Interview",
    blocks: questions.map((q, i) => ({
      type: 'text' as const,
      title: `Q${i+1}: ${q.question}`,
      content: q.answer || t("Not answered")
    }))
  });

  const updateQuestion = (id: number, field: string, val: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: val } : q));
  };
  
  const addQuestion = () => setQuestions([...questions, { id: Date.now(), question: '', answer: '' }]);

  return (
    <ToolCanvas
      emoji="🗨️"
      title="Solution Interview"
      description="Different from an empathy interview, a solution interview asks direct, pointed questions about the prototype to gauge 'willingness to use' and 'willingness to pay'."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-3">
             <div className="flex gap-4">
               <span className="font-bold text-muted-fg text-lg pt-1">Q{idx + 1}.</span>
               <input 
                 className="flex-1 font-bold text-lg bg-transparent focus:outline-none border-b border-transparent focus:border-border"
                 value={q.question}
                 onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                 placeholder={t("Interview Question")}
               />
             </div>
             <div className="pl-10">
               <textarea 
                 className="w-full h-24 bg-muted-bg border border-transparent focus:border-primary rounded-lg p-3 resize-none text-sm focus:outline-none focus:bg-background"
                 placeholder={t("User's response and insights...")}
                 value={q.answer}
                 onChange={e => updateQuestion(q.id, 'answer', e.target.value)}
               />
             </div>
          </div>
        ))}
        
        <button onClick={addQuestion} className="w-full border-2 border-dashed border-border rounded-xl p-4 font-bold text-muted-fg hover:text-primary hover:border-primary transition-colors">
          + {t("Add Question")}
        </button>

      </div>
    </ToolCanvas>
  );
}
