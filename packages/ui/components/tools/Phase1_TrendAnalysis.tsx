import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase1_TrendAnalysis() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "📈 Trend Analysis";

  const [trends, setTrends] = useState([
    { id: 1, name: '', description: '', impact: 'High', timeframe: 'Now' },
    { id: 2, name: '', description: '', impact: 'Medium', timeframe: 'Next' },
    { id: 3, name: '', description: '', impact: 'Low', timeframe: 'Later' }
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setTrends(artifact.data.trends || []);
      }
    } else {
      setTrends([
        { id: 1, name: '', description: '', impact: 'High', timeframe: 'Now' },
        { id: 2, name: '', description: '', impact: 'Medium', timeframe: 'Next' },
        { id: 3, name: '', description: '', impact: 'Low', timeframe: 'Later' }
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = trends[0]?.name ? `${trends[0].name} & Others` : 'Trend Analysis Draft';
    const id = saveArtifact(1, TOOL_NAME, title, { trends }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = trends[0]?.name ? `${trends[0].name} & Others` : 'Trend Analysis Draft';
    const id = saveArtifact(1, TOOL_NAME, title, { trends }, null);
    setActiveArtifactId(id);
  };

  const updateTrend = (id: number, field: string, value: string) => {
    setTrends(trends.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addTrend = () => {
    setTrends([...trends, { id: Date.now(), name: '', description: '', impact: 'Medium', timeframe: 'Next' }]);
  };

  const getExportData = () => ({
    title: "Trend Analysis",
    blocks: [
      {
        type: 'grid' as const,
        content: [
          ["Trend", "Description", "Impact", "Timeframe"],
          ...trends.filter(t => t.name || t.description).map(t => [
            t.name || "-", 
            t.description || "-", 
            t.impact, 
            t.timeframe
          ])
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="📈"
      title="Trend Analysis"
      description="Explore megatrends and their points of contact. Visualize the larger context of trends and discuss whether and how they interact to draw conclusions."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trends.map(trend => (
          <div key={trend.id} className="bg-muted-bg rounded-xl p-5 border border-border flex flex-col gap-4">
            <input 
              type="text" 
              placeholder={t("Trend Name (e.g. Remote Work, AI)")} 
              value={trend.name}
              onChange={e => updateTrend(trend.id, 'name', e.target.value)}
              className="bg-transparent border-b-2 border-border focus:border-primary font-bold text-lg px-1 py-2 focus:outline-none"
            />
            
            <textarea 
              rows={3}
              placeholder={t("How does this trend manifest in our industry?")} 
              value={trend.description}
              onChange={e => updateTrend(trend.id, 'description', e.target.value)}
              className="bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary resize-none"
            />
            
            <div className="flex gap-2">
              <select 
                value={trend.impact}
                onChange={e => updateTrend(trend.id, 'impact', e.target.value)}
                className="flex-1 bg-background border border-border rounded-md px-2 py-1.5 text-xs focus:outline-none cursor-pointer"
              >
                <option value="High">{t("🔴 High Impact")}</option>
                <option value="Medium">{t("🟡 Med Impact")}</option>
                <option value="Low">{t("🟢 Low Impact")}</option>
              </select>
              
              <select 
                value={trend.timeframe}
                onChange={e => updateTrend(trend.id, 'timeframe', e.target.value)}
                className="flex-1 bg-background border border-border rounded-md px-2 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Now">{t("🕒 Now (0-1 yr)")}</option>
                <option value="Next">{t("🕒 Next (1-3 yrs)")}</option>
                <option value="Later">{t("🕒 Later (3-5+ yrs)")}</option>
              </select>
            </div>
          </div>
        ))}
        
        <button 
          data-html2canvas-ignore="true"
          onClick={addTrend}
          className="rounded-xl border-2 border-dashed border-border flex items-center justify-center p-5 min-h-[250px] font-bold text-muted-fg hover:text-primary hover:border-primary transition-colors"
        >
          {t("+ Add Trend")}
        </button>
      </div>
    </ToolCanvas>
  );
}
