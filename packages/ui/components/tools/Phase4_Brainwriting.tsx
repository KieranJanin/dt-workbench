import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase4_Brainwriting() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "📝 Brainwriting";

  const [sheets, setSheets] = useState([
    { id: 1, prompt: '', r1: '', r2: '', r3: '' }
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setSheets(artifact.data.sheets || sheets);
      }
    } else {
      setSheets([{ id: 1, prompt: '', r1: '', r2: '', r3: '' }]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Brainwriting Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { sheets }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Brainwriting Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { sheets }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Brainwriting",
    blocks: sheets.map(s => ({
      type: 'list' as const,
      title: s.prompt || t("Untitled Prompt"),
      content: [s.r1, s.r2, s.r3].filter(r => r && r.trim() !== '')
    }))
  });

  const updateSheet = (id: number, field: string, value: string) => {
    setSheets(sheets.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSheet = () => setSheets([...sheets, { id: Date.now(), prompt: '', r1: '', r2: '', r3: '' }]);

  return (
    <ToolCanvas
      emoji="📝"
      title="Brainwriting"
      description="Write down ideas silently, then pass them to the next person to build upon. Great for preventing dominant voices from steering the ideation."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full flex-col flex gap-8">
         <div className="flex gap-4 overflow-x-auto pb-4">
           {sheets.map((sheet, index) => (
             <div key={sheet.id} className="min-w-[320px] max-w-[400px] flex-1 flex flex-col gap-4 border border-border bg-card rounded-xl p-4 shadow-sm relative">
                <span className="absolute -top-3 left-4 bg-primary text-black font-bold px-3 py-1 rounded-full text-xs">Sheet {index + 1}</span>
                <div className="mt-2">
                  <label className="text-xs font-bold text-muted-fg uppercase">{t("Initial Prompt / Problem")}</label>
                  <textarea 
                    className="w-full mt-1 bg-muted-bg border border-border rounded p-2 text-sm focus:outline-none focus:border-primary resize-none h-20"
                    placeholder={t("Enter prompt...")}
                    value={sheet.prompt}
                    onChange={e => updateSheet(sheet.id, 'prompt', e.target.value)}
                  />
                </div>
                
                <div className="bg-background border border-border rounded-lg p-3">
                  <label className="text-xs font-bold text-muted-fg">{t("Round 1 (Person A)")}</label>
                  <textarea className="w-full bg-transparent resize-none text-sm focus:outline-none h-16 mt-1" placeholder="Idea..." value={sheet.r1} onChange={e => updateSheet(sheet.id, 'r1', e.target.value)} />
                </div>
                
                <div className="bg-background border border-border rounded-lg p-3">
                  <label className="text-xs font-bold text-muted-fg">{t("Round 2 (Build upon R1 - Person B)")}</label>
                  <textarea className="w-full bg-transparent resize-none text-sm focus:outline-none h-16 mt-1" placeholder="Builds upon..." value={sheet.r2} onChange={e => updateSheet(sheet.id, 'r2', e.target.value)} />
                </div>

                <div className="bg-background border border-border rounded-lg p-3">
                  <label className="text-xs font-bold text-muted-fg">{t("Round 3 (Build upon R2 - Person C)")}</label>
                  <textarea className="w-full bg-transparent resize-none text-sm focus:outline-none h-16 mt-1" placeholder="Builds further..." value={sheet.r3} onChange={e => updateSheet(sheet.id, 'r3', e.target.value)} />
                </div>
             </div>
           ))}

           <div className="shrink-0 w-32 flex items-center justify-center border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:text-primary transition-colors text-muted-fg flex-col" onClick={addSheet}>
             <span className="text-3xl mb-2">+</span>
             <span className="text-sm font-bold">{t("New Sheet")}</span>
           </div>
         </div>
      </div>
    </ToolCanvas>
  );
}
