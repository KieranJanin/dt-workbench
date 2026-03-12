import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase6_FeedbackGrid() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "📥 Feedback Grid";

  const [grid, setGrid] = useState({
    worked: '',
    improve: '',
    questions: '',
    ideas: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setGrid(artifact.data.grid || grid);
      }
    } else {
      setGrid({ worked: '', improve: '', questions: '', ideas: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Feedback Grid Draft';
    const id = saveArtifact(6, TOOL_NAME, title, { grid }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Feedback Grid Draft';
    const id = saveArtifact(6, TOOL_NAME, title, { grid }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Feedback Grid",
    blocks: [
      {
        type: 'grid' as const,
        content: [
          ["Works", "Needs Improvement"],
          [grid.worked || t("-"), grid.improve || t("-")],
          ["Questions", "New Ideas"],
          [grid.questions || t("-"), grid.ideas || t("-")],
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="📥"
      title="Feedback Grid"
      description="Capture and organize raw feedback from your testing sessions into four quadrants: Works, Needs Improvement, Questions, and New Ideas."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-rows-2">
          
          <div className="p-6 border-b border-r bg-emerald-500/5 dark:bg-emerald-500/10">
            <h3 className="text-xl font-bold text-emerald-600 mb-2 flex items-center gap-2"><span className="text-2xl">+</span> {t("Works")}</h3>
            <p className="text-xs text-muted-fg mb-4">{t("What did the user easily understand or enjoy?")}</p>
            <textarea 
              className="w-full min-h-[150px] p-3 text-sm focus:outline-none bg-transparent resize-none border-b border-transparent focus:border-emerald-500"
              value={grid.worked}
              onChange={(e) => setGrid({...grid, worked: e.target.value})}
            />
          </div>

          <div className="p-6 border-b bg-rose-500/5 dark:bg-rose-500/10">
            <h3 className="text-xl font-bold text-rose-600 mb-2 flex items-center gap-2"><span className="text-2xl">Δ</span> {t("Needs Improvement")}</h3>
            <p className="text-xs text-muted-fg mb-4">{t("Where did the user struggle or get confused?")}</p>
            <textarea 
              className="w-full min-h-[150px] p-3 text-sm focus:outline-none bg-transparent resize-none border-b border-transparent focus:border-rose-500"
              value={grid.improve}
              onChange={(e) => setGrid({...grid, improve: e.target.value})}
            />
          </div>

          <div className="p-6 border-r bg-amber-500/5 dark:bg-amber-500/10">
            <h3 className="text-xl font-bold text-amber-600 mb-2 flex items-center gap-2"><span className="text-2xl">?</span> {t("Questions")}</h3>
            <p className="text-xs text-muted-fg mb-4">{t("What questions did the user ask? What new questions do you have?")}</p>
            <textarea 
              className="w-full min-h-[150px] p-3 text-sm focus:outline-none bg-transparent resize-none border-b border-transparent focus:border-amber-500"
              value={grid.questions}
              onChange={(e) => setGrid({...grid, questions: e.target.value})}
            />
          </div>

          <div className="p-6 bg-blue-500/5 dark:bg-blue-500/10">
            <h3 className="text-xl font-bold text-blue-600 mb-2 flex items-center gap-2"><span className="text-2xl">💡</span> {t("New Ideas")}</h3>
            <p className="text-xs text-muted-fg mb-4">{t("What new ideas were sparked during the test?")}</p>
            <textarea 
              className="w-full min-h-[150px] p-3 text-sm focus:outline-none bg-transparent resize-none border-b border-transparent focus:border-blue-500"
              value={grid.ideas}
              onChange={(e) => setGrid({...grid, ideas: e.target.value})}
            />
          </div>

        </div>
      </div>
    </ToolCanvas>
  );
}
