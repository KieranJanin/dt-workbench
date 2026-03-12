import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase4_BlueOcean() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🌊 Blue Ocean";

  const [grid, setGrid] = useState({
    eliminate: '',
    reduce: '',
    raise: '',
    create: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setGrid(artifact.data.grid || grid);
      }
    } else {
      setGrid({ eliminate: '', reduce: '', raise: '', create: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Blue Ocean ERRC Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { grid }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Blue Ocean ERRC Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { grid }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Blue Ocean ERRC Grid",
    blocks: [
      {
        type: 'grid' as const,
        content: [
          ["Eliminate", "Raise"],
          [grid.eliminate || t("-"), grid.raise || t("-")],
          ["Reduce", "Create"],
          [grid.reduce || t("-"), grid.create || t("-")],
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="🌊"
      title="Blue Ocean"
      description="Use the Eliminate-Reduce-Raise-Create (ERRC) grid to redefine market boundaries and unlock new demand."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-rows-2 border mt-4">
          
          <div className="p-6 border flex flex-col items-center text-center">
            <h3 className="text-xl font-bold uppercase tracking-wider text-rose-500 mb-2">{t("Eliminate")}</h3>
            <p className="text-xs text-muted-fg mb-4">{t("Which factors that the industry takes for granted should be eliminated?")}</p>
            <textarea 
              className="w-full flex-1 min-h-[120px] p-3 text-sm focus:outline-none bg-muted-bg/50 focus:bg-background border border-border focus:border-rose-500 rounded resize-none"
              value={grid.eliminate}
              onChange={(e) => setGrid({...grid, eliminate: e.target.value})}
            />
          </div>

          <div className="p-6 border flex flex-col items-center text-center">
            <h3 className="text-xl font-bold uppercase tracking-wider text-emerald-500 mb-2">{t("Raise")}</h3>
            <p className="text-xs text-muted-fg mb-4">{t("Which factors should be raised well above the industry's standard?")}</p>
            <textarea 
              className="w-full flex-1 min-h-[120px] p-3 text-sm focus:outline-none bg-muted-bg/50 focus:bg-background border border-border focus:border-emerald-500 rounded resize-none"
              value={grid.raise}
              onChange={(e) => setGrid({...grid, raise: e.target.value})}
            />
          </div>

          <div className="p-6 border flex flex-col items-center text-center">
            <h3 className="text-xl font-bold uppercase tracking-wider text-amber-500 mb-2">{t("Reduce")}</h3>
            <p className="text-xs text-muted-fg mb-4">{t("Which factors should be reduced well below the industry's standard?")}</p>
            <textarea 
              className="w-full flex-1 min-h-[120px] p-3 text-sm focus:outline-none bg-muted-bg/50 focus:bg-background border border-border focus:border-amber-500 rounded resize-none"
              value={grid.reduce}
              onChange={(e) => setGrid({...grid, reduce: e.target.value})}
            />
          </div>

          <div className="p-6 border flex flex-col items-center text-center">
            <h3 className="text-xl font-bold uppercase tracking-wider text-blue-500 mb-2">{t("Create")}</h3>
            <p className="text-xs text-muted-fg mb-4">{t("Which factors should be created that the industry has never offered?")}</p>
            <textarea 
              className="w-full flex-1 min-h-[120px] p-3 text-sm focus:outline-none bg-muted-bg/50 focus:bg-background border border-border focus:border-blue-500 rounded resize-none"
              value={grid.create}
              onChange={(e) => setGrid({...grid, create: e.target.value})}
            />
          </div>

        </div>
      </div>
    </ToolCanvas>
  );
}
