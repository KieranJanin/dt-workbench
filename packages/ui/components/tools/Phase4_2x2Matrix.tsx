import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase4_2x2Matrix() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🔲 2x2 Matrix";

  const [matrix, setMatrix] = useState({
    xAxis: 'Effort',
    yAxis: 'Impact',
    q1: '', // High Impact, High Effort
    q2: '', // High Impact, Low Effort
    q3: '', // Low Impact, Low Effort
    q4: ''  // Low Impact, High Effort
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setMatrix(artifact.data.matrix || matrix);
      }
    } else {
      setMatrix({ xAxis: 'Effort', yAxis: 'Impact', q1: '', q2: '', q3: '', q4: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = '2x2 Matrix Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { matrix }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = '2x2 Matrix Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { matrix }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "2x2 Matrix",
    blocks: [
      {
        type: 'key-value' as const,
        content: [
           { key: "X-Axis", value: matrix.xAxis },
           { key: "Y-Axis", value: matrix.yAxis }
        ]
      },
      {
        type: 'grid' as const,
        content: [
          [`High ${matrix.yAxis}, Low ${matrix.xAxis}`, `High ${matrix.yAxis}, High ${matrix.xAxis}`],
          [matrix.q2 || t("-"), matrix.q1 || t("-")],
          [`Low ${matrix.yAxis}, Low ${matrix.xAxis}`, `Low ${matrix.yAxis}, High ${matrix.xAxis}`],
          [matrix.q3 || t("-"), matrix.q4 || t("-")],
        ]
      }
    ]
  });

  const updateQuadrant = (q: keyof typeof matrix, val: string) => setMatrix({ ...matrix, [q]: val });

  return (
    <ToolCanvas
      emoji="🔲"
      title="2x2 Matrix"
      description="Plot ideas along two axes (e.g., Value vs. Complexity) to prioritize the most promising concepts to take forward."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex gap-4 items-center">
           <label className="font-bold text-sm text-muted-fg">{t("X-Axis")}</label>
           <input className="bg-muted-bg border border-border rounded p-2 focus:border-primary flex-1" value={matrix.xAxis} onChange={e => updateQuadrant('xAxis', e.target.value)} />
           <label className="font-bold text-sm text-muted-fg">{t("Y-Axis")}</label>
           <input className="bg-muted-bg border border-border rounded p-2 focus:border-primary flex-1" value={matrix.yAxis} onChange={e => updateQuadrant('yAxis', e.target.value)} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 relative">
          {/* Vertical axis line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2" />
          {/* Horizontal axis line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2" />
          
          <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl p-4 min-h-[250px] flex flex-col pt-8">
            <span className="text-xs font-bold text-emerald-600 mb-2">{t(`High ${matrix.yAxis}, Low ${matrix.xAxis} (Quick Wins)`)}</span>
            <textarea className="w-full flex-1 bg-transparent resize-none focus:outline-none" value={matrix.q2} onChange={e => updateQuadrant('q2', e.target.value)} placeholder={t("List ideas here...")} />
          </div>

          <div className="bg-blue-500/10 border-2 border-blue-500/20 rounded-2xl p-4 min-h-[250px] flex flex-col pt-8">
            <span className="text-xs font-bold text-blue-600 mb-2">{t(`High ${matrix.yAxis}, High ${matrix.xAxis} (Major Projects)`)}</span>
            <textarea className="w-full flex-1 bg-transparent resize-none focus:outline-none" value={matrix.q1} onChange={e => updateQuadrant('q1', e.target.value)} placeholder={t("List ideas here...")} />
          </div>

          <div className="bg-muted-bg border-2 border-border rounded-2xl p-4 min-h-[250px] flex flex-col">
            <span className="text-xs font-bold text-muted-fg mb-2">{t(`Low ${matrix.yAxis}, Low ${matrix.xAxis} (Fill-ins)`)}</span>
            <textarea className="w-full flex-1 bg-transparent resize-none focus:outline-none" value={matrix.q3} onChange={e => updateQuadrant('q3', e.target.value)} placeholder={t("List ideas here...")} />
          </div>

          <div className="bg-rose-500/10 border-2 border-rose-500/20 rounded-2xl p-4 min-h-[250px] flex flex-col">
            <span className="text-xs font-bold text-rose-600 mb-2">{t(`Low ${matrix.yAxis}, High ${matrix.xAxis} (Thankless Tasks)`)}</span>
            <textarea className="w-full flex-1 bg-transparent resize-none focus:outline-none" value={matrix.q4} onChange={e => updateQuadrant('q4', e.target.value)} placeholder={t("List ideas here...")} />
          </div>
        </div>
      </div>
    </ToolCanvas>
  );
}
