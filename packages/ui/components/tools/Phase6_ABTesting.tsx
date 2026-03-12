import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase6_ABTesting() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "⚖️ A/B Testing";

  const [test, setTest] = useState({
    hypothesis: '',
    metric: '',
    variantA: 'Current design (Baseline)',
    variantAMetrics: '',
    variantB: 'New redesign',
    variantBMetrics: '',
    conclusion: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setTest(artifact.data.test || test);
      }
    } else {
      setTest({
        hypothesis: '',
        metric: '',
        variantA: 'Current design (Baseline)',
        variantAMetrics: '',
        variantB: 'New redesign',
        variantBMetrics: '',
        conclusion: ''
      });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'A/B Testing Draft';
    const id = saveArtifact(6, TOOL_NAME, title, { test }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'A/B Testing Draft';
    const id = saveArtifact(6, TOOL_NAME, title, { test }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "A/B Testing Outline",
    blocks: [
      {
        type: 'key-value' as const,
        content: [
           { key: "Hypothesis", value: test.hypothesis || t("-") },
           { key: "Key Metric", value: test.metric || t("-") }
        ]
      },
      {
        type: 'grid' as const,
        content: [
          ["Variant A (Baseline)", "Variant B (Challenger)"],
          [`Desc: ${test.variantA || t("-")}`, `Desc: ${test.variantB || t("-")}`],
          [`Results: ${test.variantAMetrics || t("-")}`, `Results: ${test.variantBMetrics || t("-")}`]
        ]
      },
      { type: 'text' as const, title: "Conclusion / Next Steps", content: test.conclusion || t("-") }
    ]
  });

  return (
    <ToolCanvas
      emoji="⚖️"
      title="A/B Testing"
      description="Compare two versions of a design to see which one performs better against a specific metric."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
           <label className="text-lg font-bold block mb-2">{t("Test Hypothesis")}</label>
           <input 
             className="w-full bg-muted-bg border border-transparent focus:border-primary rounded-lg p-3 text-sm focus:outline-none focus:bg-background transition-colors"
             placeholder={t("We believe that doing [X] will result in [Y]... ")}
             value={test.hypothesis}
             onChange={(e) => setTest({...test, hypothesis: e.target.value})}
           />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
           <label className="text-lg font-bold block mb-2">{t("Key Metric (e.g., Conversion Rate)")}</label>
           <input 
             className="w-full bg-muted-bg border border-transparent focus:border-primary rounded-lg p-3 text-sm focus:outline-none focus:bg-background transition-colors"
             placeholder={t("Click-through rate on the primary CTA")}
             value={test.metric}
             onChange={(e) => setTest({...test, metric: e.target.value})}
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-900 rounded-xl p-6 shadow-sm">
             <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">{t("Variant A (Baseline)")}</h3>
             
             <label className="text-xs font-bold text-muted-fg uppercase">{t("Description")}</label>
             <textarea 
               className="w-full h-24 mt-1 mb-4 bg-white dark:bg-black border border-blue-200 dark:border-blue-800 rounded-lg p-3 resize-none text-sm focus:outline-none"
               value={test.variantA}
               onChange={(e) => setTest({...test, variantA: e.target.value})}
             />

             <label className="text-xs font-bold text-muted-fg uppercase">{t("Results / Metrics")}</label>
             <textarea 
               className="w-full h-16 mt-1 bg-white dark:bg-black border border-blue-200 dark:border-blue-800 rounded-lg p-3 resize-none text-sm focus:outline-none"
               placeholder={t("e.g. 14.2% CTR, 204 conversions")}
               value={test.variantAMetrics}
               onChange={(e) => setTest({...test, variantAMetrics: e.target.value})}
             />
           </div>

           <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 rounded-xl p-6 shadow-sm">
             <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">{t("Variant B (Challenger)")}</h3>
             
             <label className="text-xs font-bold text-muted-fg uppercase">{t("Description")}</label>
             <textarea 
               className="w-full h-24 mt-1 mb-4 bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 resize-none text-sm focus:outline-none"
               value={test.variantB}
               onChange={(e) => setTest({...test, variantB: e.target.value})}
             />

             <label className="text-xs font-bold text-muted-fg uppercase">{t("Results / Metrics")}</label>
             <textarea 
               className="w-full h-16 mt-1 bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 resize-none text-sm focus:outline-none"
               placeholder={t("e.g. 18.5% CTR, 281 conversions")}
               value={test.variantBMetrics}
               onChange={(e) => setTest({...test, variantBMetrics: e.target.value})}
             />
           </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
           <label className="text-lg font-bold block mb-2">{t("Conclusion & Next Steps")}</label>
           <textarea 
             className="w-full h-24 bg-muted-bg border border-transparent focus:border-primary rounded-lg p-3 resize-none text-sm focus:outline-none focus:bg-background transition-colors"
             placeholder={t("Variant B outperformed A by a significant margin. We will roll out Variant B to 100% of users next sprint.")}
             value={test.conclusion}
             onChange={(e) => setTest({...test, conclusion: e.target.value})}
           />
        </div>

      </div>
    </ToolCanvas>
  );
}
