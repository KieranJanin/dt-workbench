import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase1_ProblemStatement() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "❗ Problem Statement";

  const [problem, setProblem] = useState({
    user: '',
    need: '',
    insight: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setProblem(artifact.data.problem || { user: '', need: '', insight: '' });
      }
    } else {
      setProblem({ user: '', need: '', insight: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = problem.user ? `Problem: ${problem.user}` : 'Problem Statement Draft';
    const id = saveArtifact(1, TOOL_NAME, title, { problem }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = problem.user ? `Problem: ${problem.user}` : 'Problem Statement Draft';
    const id = saveArtifact(1, TOOL_NAME, title, { problem }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Problem Statement",
    blocks: [
      { type: 'section_header' as const, content: "1. The User" },
      { type: 'text' as const, content: problem.user || t("Not specified") },
      { type: 'section_header' as const, content: "2. The Need" },
      { type: 'text' as const, content: problem.need || t("Not specified") },
      { type: 'section_header' as const, content: "3. The Insight" },
      { type: 'text' as const, content: problem.insight || t("Not specified") },
      { type: 'section_header' as const, content: "✨ Synthesized Problem Statement" },
      { type: 'text' as const, content: `${problem.user || "[User]"} needs a way to ${problem.need || "[Need]"} because surprisingly, ${problem.insight || "[Insight]"}.` }
    ]
  });

  return (
    <ToolCanvas
      emoji="❗"
      title="Problem Statement"
      description="Formulate collected findings from the problem analysis into a clear Design Challenge. This forms the basis for the formulation of a target-oriented How-Might-We question."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="space-y-6">
        <div className="bg-muted-bg p-8 rounded-2xl border border-border flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-foreground text-lg">{t("1. The User")}</label>
            <p className="text-sm text-muted-fg">{t("Who precisely are we designing for? (Be specific)")}</p>
            <input
              type="text"
              placeholder={t("e.g. A busy working parent of toddlers...")}
              value={problem.user}
              onChange={(e) => setProblem({...problem, user: e.target.value})}
              className="bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary w-full"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-bold text-foreground text-lg">{t("2. The Need")}</label>
            <p className="text-sm text-muted-fg">{t("What is their overarching goal or urgent desire?")}</p>
            <input
              type="text"
              placeholder={t("e.g. Needs a way to prepare healthy dinners in under 15 minutes...")}
              value={problem.need}
              onChange={(e) => setProblem({...problem, need: e.target.value})}
              className="bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary w-full"
            />
          </div>
          
           <div className="flex flex-col gap-2">
            <label className="font-bold text-foreground text-lg">{t("3. The Insight")}</label>
            <p className="text-sm text-muted-fg">{t("What unexpected learning did we uncover about why this is hard for them?")}</p>
            <textarea
              rows={3}
              placeholder={t("e.g. Surprisingly, it's not the cooking time that's the barrier, it's the mental load of deciding WHAT to cook that causes paralysis...")}
              value={problem.insight}
              onChange={(e) => setProblem({...problem, insight: e.target.value})}
              className="bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary w-full resize-none"
            />
          </div>
        </div>

        {/* Synthesized Output */}
        {(problem.user || problem.need || problem.insight) && (
          <div className="bg-primary/10 border-2 border-primary/30 p-8 rounded-2xl mt-8">
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              {t("✨ Synthesized Problem Statement")}
            </h3>
             <p className="text-xl leading-relaxed font-medium">
               <span className="text-foreground decoration-primary underline decoration-2 underline-offset-4">{problem.user || t("[User]")}</span> {t("needs a way to")} <span className="text-foreground decoration-primary underline decoration-2 underline-offset-4">{problem.need || t("[Need]")}</span> {t("because surprisingly,")} <span className="text-foreground decoration-primary underline decoration-2 underline-offset-4">{problem.insight || t("[Insight]")}</span>.
             </p>
          </div>
        )}
      </div>
    </ToolCanvas>
  );
}
