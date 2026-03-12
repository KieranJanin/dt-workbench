import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase0_DefineSuccess() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🎯 Define Success";

  const [vision, setVision] = useState('');
  const [kpis, setKpis] = useState([
    { id: 1, metric: '', target: '' },
    { id: 2, metric: '', target: '' },
  ]);
  const [antiGoals, setAntiGoals] = useState('');

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setVision(artifact.data.vision || '');
        setKpis(artifact.data.kpis || []);
        setAntiGoals(artifact.data.antiGoals || '');
      }
    } else {
      setVision('');
      setKpis([{ id: 1, metric: '', target: '' }, { id: 2, metric: '', target: '' }]);
      setAntiGoals('');
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = vision ? vision.substring(0, 30) + '...' : 'Define Success Draft';
    const id = saveArtifact(0, TOOL_NAME, title, { vision, kpis, antiGoals }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = vision ? vision.substring(0, 30) + '...' : 'Define Success Draft';
    const id = saveArtifact(0, TOOL_NAME, title, { vision, kpis, antiGoals }, null);
    setActiveArtifactId(id);
  };

  const updateKpi = (id: number, field: 'metric' | 'target', value: string) => {
    setKpis(kpis.map(k => k.id === id ? { ...k, [field]: value } : k));
  };

  const getExportData = () => ({
    title: "Define Success",
    blocks: [
      { type: 'section_header' as const, content: "Project Vision" },
      { type: 'text' as const, content: vision || t("Not specified") },
      { type: 'section_header' as const, content: "Key Performance Indicators (KPIs)" },
      {
        type: 'grid' as const,
        content: [
          ["Metric", "Target"],
          ...kpis.filter(k => k.metric || k.target).map(k => [k.metric || "-", k.target || "-"])
        ]
      },
      { type: 'section_header' as const, content: "Anti-Goals (Out of Scope)" },
      { type: 'text' as const, content: antiGoals || t("Not specified") }
    ]
  });

  return (
    <ToolCanvas
      emoji="🎯"
      title="Define Success"
      description="Establish what success looks like and how it will be measured to ensure requirements are understood and aligned with decision makers."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="space-y-8">
        {/* Project Vision Block */}
        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            {t("👁️ Project Vision")}
          </h3>
          <p className="text-sm text-muted-fg mb-4">{t("In a single sentence, what does the ultimate success of this project look like?")}</p>
          <textarea
            placeholder={t("e.g., We will completely eliminate manual data entry for the sales team by Q3...")}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            rows={2}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary resize-none text-lg font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* KPIs */}
          <div>
            <h3 className="font-bold text-lg mb-2 border-b border-border pb-2">{t("Key Performance Indicators (KPIs)")}</h3>
            <div className="space-y-3 mt-4">
              {kpis.map((kpi, index) => (
                <div key={kpi.id} className="flex gap-2">
                  <div className="bg-muted-bg border border-border rounded-lg px-3 py-2 flex items-center justify-center font-mono text-sm shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    placeholder={t("Metric (e.g. Conversion Rate)")}
                    value={kpi.metric}
                    onChange={(e) => updateKpi(kpi.id, 'metric', e.target.value)}
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm min-w-0"
                  />
                  <input
                    type="text"
                    placeholder={t("Target (e.g. +15%)")}
                    value={kpi.target}
                    onChange={(e) => updateKpi(kpi.id, 'target', e.target.value)}
                    className="w-32 bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-sm shrink-0"
                  />
                </div>
              ))}
              <button 
                data-html2canvas-ignore="true"
                onClick={() => setKpis([...kpis, { id: Date.now(), metric: '', target: '' }])}
                className="text-sm font-semibold text-primary hover:underline px-1 inline-block mt-2"
              >
                {t("+ Add Outcome Metric")}
              </button>
            </div>
          </div>

          {/* Anti-Goals */}
          <div>
            <h3 className="font-bold text-lg mb-2 border-b border-border pb-2 flex items-center gap-2">
               {t("Anti-Goals (Out of Scope)")}
            </h3>
            <p className="text-sm text-muted-fg mb-3 mt-4">{t("What are we explicitly NOT trying to achieve or solve right now?")}</p>
            <textarea
              placeholder={t("1. We are not replacing the core ERP system.\n2. We will not support legacy Internet Explorer...")}
              value={antiGoals}
              onChange={(e) => setAntiGoals(e.target.value)}
              rows={5}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary resize-none text-sm"
            />
          </div>
        </div>
      </div>
    </ToolCanvas>
  );
}
