import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase5_ExplorationMap() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🗺️ Exploration Map";

  const [map, setMap] = useState({
    vision: '',
    alternatives: '',
    selectedConcept: '',
    rationale: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setMap(artifact.data.map || map);
      }
    } else {
      setMap({ vision: '', alternatives: '', selectedConcept: '', rationale: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Exploration Map Draft';
    const id = saveArtifact(5, TOOL_NAME, title, { map }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Exploration Map Draft';
    const id = saveArtifact(5, TOOL_NAME, title, { map }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Exploration Map",
    blocks: [
      { type: 'text' as const, title: 'Concept Vision', content: map.vision || t("-") },
      { type: 'text' as const, title: 'Alternatives Considered', content: map.alternatives || t("-") },
      { type: 'text' as const, title: 'Selected Concept', content: map.selectedConcept || t("-") },
      { type: 'text' as const, title: 'Rationale', content: map.rationale || t("-") }
    ]
  });

  return (
    <ToolCanvas
      emoji="🗺️"
      title="Exploration Map"
      description="Document the journey from many ideas to one solid concept. Show what was explored and why this specific path was chosen to prototype."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-2">{t("Concept Vision")}</h3>
          <textarea 
            className="w-full bg-muted-bg border border-transparent focus:border-primary rounded-lg p-3 resize-none focus:outline-none focus:bg-background"
            rows={3}
            placeholder={t("Briefly describe the overarching vision...")}
            value={map.vision}
            onChange={(e) => setMap({ ...map, vision: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2 text-muted-fg">{t("Alternatives Considered")}</h3>
            <textarea 
              className="w-full bg-muted-bg border border-transparent focus:border-primary rounded-lg p-3 resize-none focus:outline-none focus:bg-background h-48"
              placeholder={t("What other paths did we explore? Why did we discard them?")}
              value={map.alternatives}
              onChange={(e) => setMap({ ...map, alternatives: e.target.value })}
            />
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2 text-primary">{t("Selected Concept")}</h3>
            <textarea 
              className="w-full bg-background/50 border border-transparent focus:border-primary rounded-lg p-3 resize-none focus:outline-none focus:bg-background h-48"
              placeholder={t("Describe the final concept we are going to prototype in detail...")}
              value={map.selectedConcept}
              onChange={(e) => setMap({ ...map, selectedConcept: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-2">{t("Rationale / Strategic Fit")}</h3>
          <textarea 
            className="w-full bg-muted-bg border border-transparent focus:border-primary rounded-lg p-3 resize-none focus:outline-none focus:bg-background"
            rows={3}
            placeholder={t("Why is this the absolute best bet? How does it align with the HMW and business goals?")}
            value={map.rationale}
            onChange={(e) => setMap({ ...map, rationale: e.target.value })}
          />
        </div>

      </div>
    </ToolCanvas>
  );
}
