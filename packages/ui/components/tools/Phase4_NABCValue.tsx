import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase4_NABCValue() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🏆 NABC Value";

  const [nabc, setNabc] = useState({
    need: '',
    approach: '',
    benefit: '',
    competition: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setNabc(artifact.data.nabc || nabc);
      }
    } else {
      setNabc({ need: '', approach: '', benefit: '', competition: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'NABC Value Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { nabc }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'NABC Value Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { nabc }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "NABC Value Proposition",
    blocks: [
      { type: 'text' as const, title: 'Need', content: nabc.need || t("-") },
      { type: 'text' as const, title: 'Approach', content: nabc.approach || t("-") },
      { type: 'text' as const, title: 'Benefit per costs', content: nabc.benefit || t("-") },
      { type: 'text' as const, title: 'Competition', content: nabc.competition || t("-") }
    ]
  });

  return (
    <ToolCanvas
      emoji="🏆"
      title="NABC Value"
      description="Quickly craft a value proposition for an idea: Need, Approach, Benefit per costs, and Competition."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        
        <div className="bg-card border-t-4 border-rose-500 rounded-xl p-6 shadow-sm border-x border-b">
          <h3 className="text-xl font-bold mb-2">Need</h3>
          <p className="text-xs text-muted-fg mb-4">{t("What is the important customer and market need?")}</p>
          <textarea 
            className="w-full h-32 bg-muted-bg border border-transparent focus:border-rose-500 focus:outline-none rounded-lg p-3 resize-none text-sm"
            placeholder={t("The user urgently needs...")}
            value={nabc.need}
            onChange={(e) => setNabc({ ...nabc, need: e.target.value })}
          />
        </div>

        <div className="bg-card border-t-4 border-blue-500 rounded-xl p-6 shadow-sm border-x border-b">
          <h3 className="text-xl font-bold mb-2">Approach</h3>
          <p className="text-xs text-muted-fg mb-4">{t("What is our unique approach to solving this need?")}</p>
          <textarea 
            className="w-full h-32 bg-muted-bg border border-transparent focus:border-blue-500 focus:outline-none rounded-lg p-3 resize-none text-sm"
            placeholder={t("We will build...")}
            value={nabc.approach}
            onChange={(e) => setNabc({ ...nabc, approach: e.target.value })}
          />
        </div>

        <div className="bg-card border-t-4 border-emerald-500 rounded-xl p-6 shadow-sm border-x border-b">
          <h3 className="text-xl font-bold mb-2">Benefit per costs</h3>
          <p className="text-xs text-muted-fg mb-4">{t("What is the specific quantitative/qualitative benefit vs cost?")}</p>
          <textarea 
            className="w-full h-32 bg-muted-bg border border-transparent focus:border-emerald-500 focus:outline-none rounded-lg p-3 resize-none text-sm"
            placeholder={t("Users will save 2 hours per day...")}
            value={nabc.benefit}
            onChange={(e) => setNabc({ ...nabc, benefit: e.target.value })}
          />
        </div>

        <div className="bg-card border-t-4 border-amber-500 rounded-xl p-6 shadow-sm border-x border-b">
          <h3 className="text-xl font-bold mb-2">Competition</h3>
          <p className="text-xs text-muted-fg mb-4">{t("How are others addressing this need, and why are we better?")}</p>
          <textarea 
            className="w-full h-32 bg-muted-bg border border-transparent focus:border-amber-500 focus:outline-none rounded-lg p-3 resize-none text-sm"
            placeholder={t("Unlike competitors who charge per seat...")}
            value={nabc.competition}
            onChange={(e) => setNabc({ ...nabc, competition: e.target.value })}
          />
        </div>

      </div>
    </ToolCanvas>
  );
}
