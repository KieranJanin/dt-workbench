import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase1_5xWhy() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "❓ 5x Why";

  const [problem, setProblem] = useState('');
  const [whys, setWhys] = useState([
    { id: 1, answer: '' },
    { id: 2, answer: '' },
    { id: 3, answer: '' },
    { id: 4, answer: '' },
    { id: 5, answer: '' },
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setProblem(artifact.data.problem || '');
        setWhys(artifact.data.whys || []);
      }
    } else {
      setProblem('');
      setWhys([
        { id: 1, answer: '' },
        { id: 2, answer: '' },
        { id: 3, answer: '' },
        { id: 4, answer: '' },
        { id: 5, answer: '' },
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = problem ? `5x Why: ${problem.substring(0, 20)}` : '5x Why Draft';
    const id = saveArtifact(1, TOOL_NAME, title, { problem, whys }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = problem ? `5x Why: ${problem.substring(0, 20)}` : '5x Why Draft';
    const id = saveArtifact(1, TOOL_NAME, title, { problem, whys }, null);
    setActiveArtifactId(id);
  };

  const updateWhy = (id: number, answer: string) => {
    setWhys(whys.map(w => w.id === id ? { ...w, answer } : w));
  };

  const getExportData = () => ({
    title: "5x Why",
    blocks: [
      { type: 'section_header' as const, content: "The Symptoms (Start Here)" },
      { type: 'text' as const, content: problem || t("Not specified") },
      { type: 'section_header' as const, content: "The 5 Whys" },
      { type: 'list' as const, content: whys.filter(w => w.answer).map(w => `Why? (Level ${w.id}): ${w.answer}`) },
      ...(whys[4].answer ? [
        { type: 'section_header' as const, content: "Root Cause Identified" },
        { type: 'text' as const, content: whys[4].answer }
      ] : [])
    ]
  });

  return (
    <ToolCanvas
      emoji="❓"
      title="5x Why"
      description="Dig deeper and experience more than just superficially exploring the symptoms that are obvious. Discover the true root cause of a problem."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
        <div className="bg-primary/10 border-2 border-primary/20 rounded-xl p-6 mb-4">
          <label className="font-bold text-lg text-primary block mb-2">{t("The Symptoms (Start Here)")}</label>
          <input
            type="text"
            placeholder={t("e.g. Users are dropping off at the checkout screen...")}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary font-medium"
          />
        </div>

        <div className="space-y-4 pl-4 border-l-4 border-muted-bg ml-4">
          {whys.map((why, idx) => (
            <div key={why.id} className="relative">
              {/* Connector dot */}
              <div className="absolute -left-[22px] top-4 w-3 h-3 rounded-full bg-border border-2 border-background" />
              
              <div className="bg-muted-bg rounded-xl p-4 border border-border">
                <label className="font-bold text-sm text-muted-fg block mb-2">
                  <span className="text-foreground">{t("Why?")}</span> ({t("Level")} {why.id})
                </label>
                <textarea
                  rows={2}
                  placeholder={t("Why did the above happen?")}
                  value={why.answer}
                  onChange={(e) => updateWhy(why.id, e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        {whys[4].answer && (
          <div className="bg-warning/10 border-2 border-warning/30 rounded-xl p-6 mt-4 relative overflow-hidden">
             <div className="absolute -right-4 -top-8 text-8xl opacity-10 font-bold text-warning">!</div>
             <h3 className="font-bold text-warning text-lg mb-2 relative z-10">{t("Root Cause Identified")}</h3>
             <p className="text-foreground relative z-10 font-medium">
               {t("This is likely the systemic issue that needs to be solved, rather than placing a band-aid on the checkout screen.")}
             </p>
          </div>
        )}
      </div>
    </ToolCanvas>
  );
}
