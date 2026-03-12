import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase3_EmpathyMap() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🧠 Empathy Map";

  const [map, setMap] = useState({
    says: '',
    thinks: '',
    does: '',
    feels: '',
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setMap(artifact.data.map || { says: '', thinks: '', does: '', feels: '' });
      }
    } else {
      setMap({ says: '', thinks: '', does: '', feels: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Empathy Map Draft';
    const id = saveArtifact(3, TOOL_NAME, title, { map }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Empathy Map Draft';
    const id = saveArtifact(3, TOOL_NAME, title, { map }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Empathy Map",
    blocks: [
      {
        type: 'grid' as const,
        content: [
          ["Says", "Thinks"],
          [map.says || "-", map.thinks || "-"],
          ["Does", "Feels"],
          [map.does || "-", map.feels || "-"]
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="🧠"
      title="Empathy Map"
      description="Synthesize observations to draw out unexpected insights. What is the user actually experiencing vs what they are saying?"
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col h-full w-full max-w-5xl mx-auto justify-center">
        
        {/* Center Target */}
        <div className="relative w-full aspect-square md:aspect-video max-h-[600px] mb-8">
           {/* Crosshairs */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-1 bg-border rounded-full" />
              <div className="h-full w-1 bg-border rounded-full absolute" />
              <div className="w-24 h-24 bg-background border-4 border-primary rounded-full absolute z-10 flex items-center justify-center shadow-lg">
                <span className="text-3xl">👤</span>
              </div>
           </div>

           {/* Quadrants */}
           <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4 p-4">
              
              {/* Says */}
              <div className="flex flex-col bg-blue-500/5 hover:bg-blue-500/10 transition-colors rounded-3xl border-2 border-transparent hover:border-blue-500/30 p-6 pt-8 pl-8">
                 <h3 className="font-bold text-2xl text-blue-500 mb-4 uppercase tracking-widest">{t("Says")}</h3>
                 <textarea 
                   placeholder={t("Quotes & key words...")} 
                   value={map.says} 
                   onChange={e => setMap({...map, says: e.target.value})}
                   className="w-full h-full bg-transparent resize-none focus:outline-none font-medium text-lg leading-relaxed"
                 />
              </div>

              {/* Thinks */}
              <div className="flex flex-col bg-purple-500/5 hover:bg-purple-500/10 transition-colors rounded-3xl border-2 border-transparent hover:border-purple-500/30 p-6 pt-8 pr-8 items-end text-right">
                 <h3 className="font-bold text-2xl text-purple-500 mb-4 uppercase tracking-widest">{t("Thinks")}</h3>
                 <textarea 
                   placeholder={t("Internal beliefs, logic...")} 
                   value={map.thinks} 
                   onChange={e => setMap({...map, thinks: e.target.value})}
                   className="w-full h-full bg-transparent resize-none focus:outline-none font-medium text-lg text-right leading-relaxed"
                 />
              </div>

              {/* Does */}
              <div className="flex flex-col justify-end bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors rounded-3xl border-2 border-transparent hover:border-emerald-500/30 p-6 pb-8 pl-8">
                 <textarea 
                   placeholder={t("Actions and behaviors...")} 
                   value={map.does} 
                   onChange={e => setMap({...map, does: e.target.value})}
                   className="w-full h-full bg-transparent resize-none focus:outline-none font-medium text-lg leading-relaxed mt-auto"
                 />
                 <h3 className="font-bold text-2xl text-emerald-500 mt-4 uppercase tracking-widest">{t("Does")}</h3>
              </div>

              {/* Feels */}
              <div className="flex flex-col justify-end bg-rose-500/5 hover:bg-rose-500/10 transition-colors rounded-3xl border-2 border-transparent hover:border-rose-500/30 p-6 pb-8 pr-8 items-end text-right">
                 <textarea 
                   placeholder={t("Emotions and physiological responses...")} 
                   value={map.feels} 
                   onChange={e => setMap({...map, feels: e.target.value})}
                   className="w-full h-full bg-transparent resize-none focus:outline-none font-medium text-lg text-right leading-relaxed mt-auto"
                 />
                 <h3 className="font-bold text-2xl text-rose-500 mt-4 uppercase tracking-widest">{t("Feels")}</h3>
              </div>

           </div>
        </div>

      </div>
    </ToolCanvas>
  );
}
