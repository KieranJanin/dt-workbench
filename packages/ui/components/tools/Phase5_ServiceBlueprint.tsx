import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase5_ServiceBlueprint() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "⚙️ Service Blueprint";

  const [steps, setSteps] = useState([
    { id: 1, name: 'Step 1', customer: '', frontstage: '', backstage: '', support: '' },
    { id: 2, name: 'Step 2', customer: '', frontstage: '', backstage: '', support: '' }
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setSteps(artifact.data.steps || steps);
      }
    } else {
      setSteps([
        { id: 1, name: 'Step 1', customer: '', frontstage: '', backstage: '', support: '' },
        { id: 2, name: 'Step 2', customer: '', frontstage: '', backstage: '', support: '' }
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Service Blueprint Draft';
    const id = saveArtifact(5, TOOL_NAME, title, { steps }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Service Blueprint Draft';
    const id = saveArtifact(5, TOOL_NAME, title, { steps }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => {
    return {
      title: "Service Blueprint",
      blocks: [
        {
          type: 'grid' as const,
          content: [
            ["Step", "Customer Action", "Frontstage", "Backstage", "Support Processes"],
            ...steps.map((s, i) => [
              s.name || `Step ${i+1}`,
              s.customer || t("-"),
              s.frontstage || t("-"),
              s.backstage || t("-"),
              s.support || t("-")
            ])
          ]
        }
      ]
    };
  };

  const updateStep = (id: number, field: string, val: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const addStep = () => {
    setSteps([...steps, { id: Date.now(), name: `Step ${steps.length + 1}`, customer: '', frontstage: '', backstage: '', support: '' }]);
  };

  return (
    <ToolCanvas
      emoji="⚙️"
      title="Service Blueprint"
      description="Map the end-to-end service delivery physically and digitally. Link customer actions to frontstage UI, backstage databases, and support team operations."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full flex flex-col gap-6 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1000px]">
           {steps.map((step, idx) => (
             <div key={step.id} className="flex-1 flex flex-col min-w-[250px] gap-2">
                <input 
                  className="font-bold text-center text-lg bg-transparent focus:outline-none border-b border-border focus:border-primary mb-4 p-1"
                  value={step.name}
                  onChange={e => updateStep(step.id, 'name', e.target.value)}
                  placeholder={`Step ${idx + 1}`}
                />
                
                {/* Customer Journey */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                  <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{t("Customer Action")}</label>
                  <textarea className="w-full bg-transparent mt-1 text-sm resize-none h-16 focus:outline-none" value={step.customer} onChange={e => updateStep(step.id, 'customer', e.target.value)} placeholder={t("User does what?")} />
                </div>

                <div className="h-4 flex justify-center items-center"><span className="text-muted-fg text-xs">↓</span></div>
                <div className="w-full border-t border-dashed border-border mb-1" title="Line of Interaction" />

                {/* Frontstage */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{t("Frontstage (Visible)")}</label>
                  <textarea className="w-full bg-transparent mt-1 text-sm resize-none h-16 focus:outline-none" value={step.frontstage} onChange={e => updateStep(step.id, 'frontstage', e.target.value)} placeholder={t("App screen, employee...")} />
                </div>

                <div className="h-4 flex justify-center items-center"><span className="text-muted-fg text-xs">↓</span></div>
                <div className="w-full border-t border-dashed border-border mb-1" title="Line of Visibility" />

                {/* Backstage */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <label className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">{t("Backstage (Invisible)")}</label>
                  <textarea className="w-full bg-transparent mt-1 text-sm resize-none h-16 focus:outline-none" value={step.backstage} onChange={e => updateStep(step.id, 'backstage', e.target.value)} placeholder={t("Background systems, rules...")} />
                </div>

                <div className="w-full border-t border-border mt-3 mb-1" title="Line of Internal Interaction" />

                {/* Support Processes */}
                <div className="bg-muted-bg border border-border rounded-lg p-3">
                  <label className="text-[10px] font-bold text-muted-fg uppercase tracking-wider">{t("Support Processes")}</label>
                  <textarea className="w-full bg-transparent mt-1 text-sm resize-none h-16 focus:outline-none" value={step.support} onChange={e => updateStep(step.id, 'support', e.target.value)} placeholder={t("Databases, 3rd party APIs...")} />
                </div>

             </div>
           ))}

           <div className="shrink-0 w-24 flex items-center justify-center border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:text-primary transition-colors text-muted-fg flex-col" onClick={addStep}>
             <span className="text-3xl mb-2">+</span>
             <span className="text-sm font-bold text-center">{t("Add Step")}</span>
           </div>
        </div>
      </div>
    </ToolCanvas>
  );
}
