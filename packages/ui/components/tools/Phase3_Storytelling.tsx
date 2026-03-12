import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase3_Storytelling() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "📖 Storytelling";

  const [story, setStory] = useState({
    hero: '',
    incitingIncident: '',
    climax: '',
    resolution: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setStory(artifact.data.story || { hero: '', incitingIncident: '', climax: '', resolution: '' });
      }
    } else {
      setStory({ hero: '', incitingIncident: '', climax: '', resolution: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Story Draft';
    const id = saveArtifact(3, TOOL_NAME, title, { story }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Story Draft';
    const id = saveArtifact(3, TOOL_NAME, title, { story }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Storytelling",
    blocks: [
      { type: 'section_header' as const, content: "1. The Hero" },
      { type: 'text' as const, content: story.hero || t("Not specified") },
      { type: 'section_header' as const, content: "2. Inciting Incident" },
      { type: 'text' as const, content: story.incitingIncident || t("Not specified") },
      { type: 'section_header' as const, content: "3. The Climax" },
      { type: 'text' as const, content: story.climax || t("Not specified") },
      { type: 'section_header' as const, content: "4. The Resolution (The HMW)" },
      { type: 'text' as const, content: story.resolution || t("Not specified") }
    ]
  });

  return (
    <ToolCanvas
      emoji="📖"
      title="Storytelling"
      description="Translate your persona and problem into a compelling narrative arc. Stories align teams around the emotional core of the problem before ideation begins."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col h-full w-full max-w-4xl mx-auto gap-8 justify-center">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
           
           {/* Visual Path - Desktop */}
           <div className="hidden md:block absolute top-1/2 left-1/4 w-1/2 h-full border-l-2 border-t-2 border-primary/20 rounded-tl-[100px] -z-10 translate-y-8" />

           {/* Panel 1 */}
           <div className="bg-card border border-border rounded-2xl p-6 shadow-sm z-10 relative">
             <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-black font-bold rounded-full flex items-center justify-center text-lg shadow-md">1</div>
             <h3 className="font-bold text-xl mb-2 text-foreground">{t("The Hero")}</h3>
             <p className="text-xs text-muted-fg mb-4">{t("Introduce the persona, their status quo, and their goal.")}</p>
             <textarea 
               rows={4} 
               value={story.hero} 
               onChange={e => setStory({...story, hero: e.target.value})} 
               placeholder={t("Emma is a dedicated team lead who wants her junior devs to feel supported...")} 
               className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background h-[calc(100%-4rem)]" 
             />
           </div>

           {/* Panel 2 */}
           <div className="bg-card border border-border rounded-2xl p-6 shadow-sm z-10 relative">
             <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-black font-bold rounded-full flex items-center justify-center text-lg shadow-md">2</div>
             <h3 className="font-bold text-xl mb-2 text-foreground">{t("Inciting Incident")}</h3>
             <p className="text-xs text-muted-fg mb-4">{t("What disrupts the status quo? The trigger for the problem.")}</p>
             <textarea 
               rows={4} 
               value={story.incitingIncident} 
               onChange={e => setStory({...story, incitingIncident: e.target.value})} 
               placeholder={t("The company mandates a sudden 100% remote policy...")} 
               className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background h-[calc(100%-4rem)]" 
             />
           </div>

           {/* Panel 3 */}
           <div className="bg-card border border-border rounded-2xl p-6 shadow-sm z-10 relative mt-8 md:mt-0">
             <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-black font-bold rounded-full flex items-center justify-center text-lg shadow-md">3</div>
             <h3 className="font-bold text-xl mb-2 text-foreground">{t("The Climax")}</h3>
             <p className="text-xs text-muted-fg mb-4">{t("The peak of frustration. The problem at its absolute worst.")}</p>
             <textarea 
               rows={4} 
               value={story.climax} 
               onChange={e => setStory({...story, climax: e.target.value})} 
               placeholder={t("Emma discovers a junior dev has been stuck for 3 days but was too afraid to ask for a meeting link...")} 
               className="w-full bg-rose-500/5 border border-rose-500/20 focus:border-rose-500 rounded-lg p-3 text-sm resize-none focus:outline-none font-medium h-[calc(100%-4rem)] text-foreground" 
             />
           </div>

           {/* Panel 4 */}
           <div className="bg-card border border-border rounded-2xl p-6 shadow-sm z-10 relative md:translate-y-12">
             <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-black font-bold rounded-full flex items-center justify-center text-lg shadow-md">4</div>
             <h3 className="font-bold text-xl mb-2 text-foreground">{t("The Resolution (The HMW)")}</h3>
             <p className="text-xs text-muted-fg mb-4">{t("The dramatic question. The cliffhanger right before the new solution is pitched.")}</p>
             <textarea 
               rows={4} 
               value={story.resolution} 
               onChange={e => setStory({...story, resolution: e.target.value})} 
               placeholder={t("If only she had a way to signal approachability without scheduling...")} 
               className="w-full bg-primary/10 border-transparent focus:border-primary flex-1 rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-primary/5 font-medium h-[calc(100%-4rem)] text-foreground shadow-inner" 
             />
           </div>

        </div>

      </div>
    </ToolCanvas>
  );
}
