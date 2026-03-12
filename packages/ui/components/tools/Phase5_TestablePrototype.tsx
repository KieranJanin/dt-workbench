import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase5_TestablePrototype() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🛠️ Testable Prototype";

  const [proto, setProto] = useState({
    name: '',
    assumption: '',
    format: 'Wireframe',
    metrics: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setProto(artifact.data.proto || proto);
      }
    } else {
      setProto({ name: '', assumption: '', format: 'Wireframe', metrics: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Testable Prototype Draft';
    const id = saveArtifact(5, TOOL_NAME, title, { proto }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Testable Prototype Draft';
    const id = saveArtifact(5, TOOL_NAME, title, { proto }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Testable Prototype Definition",
    blocks: [
      {
        type: 'key-value' as const,
        content: [
           { key: "Prototype Name", value: proto.name || t("Untitled") },
           { key: "Format", value: proto.format },
           { key: "Core Assumption Tested", value: proto.assumption || t("-") },
           { key: "Success Metrics", value: proto.metrics || t("-") }
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="🛠️"
      title="Testable Prototype"
      description="Define exactly what you are building, what core assumption it tests, and how you will measure success before investing time in building it."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <label className="text-sm font-bold text-muted-fg">{t("Prototype Name / Scope")}</label>
             <input 
               className="w-full p-3 bg-muted-bg border border-border rounded-lg focus:outline-none focus:border-primary"
               placeholder={t("e.g. 'One-click checkout flow'")}
               value={proto.name}
               onChange={(e) => setProto({...proto, name: e.target.value})}
             />
           </div>
           
           <div className="space-y-2">
             <label className="text-sm font-bold text-muted-fg">{t("Prototype Format")}</label>
             <select 
               className="w-full p-3 bg-muted-bg border border-border rounded-lg focus:outline-none focus:border-primary"
               value={proto.format}
               onChange={(e) => setProto({...proto, format: e.target.value})}
             >
               <option value="Wireframes / Figma">Wireframes / Figma</option>
               <option value="Paper Prototype">Paper Prototype</option>
               <option value="Roleplay / Storyboard">Roleplay / Storyboard</option>
               <option value="Wizard of Oz">Wizard of Oz</option>
               <option value="Coded MVP">Coded MVP</option>
             </select>
           </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 shadow-sm">
          <label className="text-lg font-bold text-amber-600 mb-2 block">{t("Core Critical Assumption")}</label>
          <p className="text-xs text-muted-fg mb-4">{t("What is the single riskiest assumption that, if false, causes this entire concept to fail?")}</p>
          <textarea 
             className="w-full h-32 bg-background border border-border focus:border-amber-500 rounded-lg p-3 resize-none text-sm focus:outline-none"
             placeholder={t("We assume users will actually trust an AI to sort their emails automatically...")}
             value={proto.assumption}
             onChange={(e) => setProto({...proto, assumption: e.target.value})}
          />
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 shadow-sm">
          <label className="text-lg font-bold text-emerald-600 mb-2 block">{t("Success Metrics / Invalidators")}</label>
          <p className="text-xs text-muted-fg mb-4">{t("What specific behaviors during testing will prove or disprove this assumption?")}</p>
          <textarea 
             className="w-full h-32 bg-background border border-border focus:border-emerald-500 rounded-lg p-3 resize-none text-sm focus:outline-none"
             placeholder={t("Validation: 4/5 users complete the flow without asking for help. Invalidation: 3+ users try to bypass the AI step...")}
             value={proto.metrics}
             onChange={(e) => setProto({...proto, metrics: e.target.value})}
          />
        </div>

      </div>
    </ToolCanvas>
  );
}
