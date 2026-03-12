import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase3_UserPersona() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "👤 User Persona";

  const [persona, setPersona] = useState({
    name: '',
    quote: '',
    demographics: '',
    goals: '',
    frustrations: '',
    story: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setPersona(artifact.data.persona || { name: '', quote: '', demographics: '', goals: '', frustrations: '', story: '' });
      }
    } else {
      setPersona({ name: '', quote: '', demographics: '', goals: '', frustrations: '', story: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = persona.name ? `Persona: ${persona.name}` : 'User Persona Draft';
    const id = saveArtifact(3, TOOL_NAME, title, { persona }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = persona.name ? `Persona: ${persona.name}` : 'User Persona Draft';
    const id = saveArtifact(3, TOOL_NAME, title, { persona }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "User Persona",
    blocks: [
      { type: 'section_header' as const, content: `Persona: ${persona.name || t("Not specified")}` },
      { type: 'text' as const, title: "Quote", content: `"${persona.quote || t("Not specified")}"` },
      {
        type: 'key-value' as const,
        content: [
          { key: "Demographics & Profile", value: persona.demographics || t("Not specified") },
          { key: "Goals & Needs", value: persona.goals || t("Not specified") },
          { key: "Frustrations & Pain Points", value: persona.frustrations || t("Not specified") }
        ]
      },
      { type: 'section_header' as const, content: "The Story & Scenario" },
      { type: 'text' as const, content: persona.story || t("Not specified") }
    ]
  });

  return (
    <ToolCanvas
      emoji="👤"
      title="User Persona"
      description="Create a tangible archetype based on your qualitative research. Refer back to this persona constantly during ideation to stay grounded in real needs."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-6 pb-8">
        
        {/* Header Block */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center">
           <div className="w-32 h-32 bg-muted-bg border-4 border-background shadow-md rounded-full flex items-center justify-center shrink-0 overflow-hidden relative group cursor-pointer transition-transform hover:scale-105">
             <span className="text-6xl group-hover:opacity-0 transition-opacity">📸</span>
             <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-black font-bold text-xs text-center p-2">
               {t("Upload Photo (Coming Soon)")}
             </div>
           </div>
           
           <div className="flex-1 w-full space-y-4">
             <input 
               type="text" 
               placeholder={t("Persona Name (e.g. 'Emma the Efficient Manager')")}
               value={persona.name}
               onChange={e => setPersona({...persona, name: e.target.value})}
               className="w-full bg-transparent border-b-2 border-border focus:border-primary font-bold px-0 py-2 text-3xl focus:outline-none"
             />
             <input 
               type="text" 
               placeholder={t("Quote: 'I just need things to work the first time.'")}
               value={persona.quote}
               onChange={e => setPersona({...persona, quote: e.target.value})}
               className="w-full bg-transparent border-none px-0 py-1 text-xl italic text-muted-fg focus:outline-none focus:text-primary transition-colors"
             />
           </div>
        </div>

        {/* 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
           
           {/* Left */}
           <div className="flex flex-col gap-6">
              <div className="bg-muted-bg border border-border rounded-2xl p-6 flex-1">
                 <h3 className="font-bold text-sm uppercase tracking-wider text-muted-fg mb-4">{t("Demographics & Profile")}</h3>
                 <textarea 
                   rows={6}
                   placeholder={t("- 34 years old\n- Remote worker\n- Tech-savvy but time-poor")}
                   value={persona.demographics}
                   onChange={e => setPersona({...persona, demographics: e.target.value})}
                   className="w-full h-[calc(100%-2rem)] bg-transparent resize-none focus:outline-none text-sm leading-relaxed"
                 />
              </div>
           </div>

           {/* Middle & Right (Span 2) */}
           <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
                   <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">{t("Goals & Needs")}</h3>
                   <textarea 
                     rows={5}
                     placeholder={t("What are they trying to achieve?")}
                     value={persona.goals}
                     onChange={e => setPersona({...persona, goals: e.target.value})}
                     className="w-full bg-transparent resize-none focus:outline-none text-sm font-medium"
                   />
                 </div>

                 <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6">
                   <h3 className="font-bold text-sm uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-4">{t("Frustrations & Pain Points")}</h3>
                   <textarea 
                     rows={5}
                     placeholder={t("What blocks them from success?")}
                     value={persona.frustrations}
                     onChange={e => setPersona({...persona, frustrations: e.target.value})}
                     className="w-full bg-transparent resize-none focus:outline-none text-sm font-medium"
                   />
                 </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 flex-1">
                 <h3 className="font-bold text-sm uppercase tracking-wider text-primary mb-4">{t("The Story & Scenario")}</h3>
                 <textarea 
                   placeholder={t("Write a brief narrative of a day in their life...")}
                   value={persona.story}
                   onChange={e => setPersona({...persona, story: e.target.value})}
                   className="w-full h-[calc(100%-2rem)] min-h-[150px] bg-transparent resize-none focus:outline-none text-base leading-relaxed"
                 />
              </div>

           </div>
        </div>

      </div>
    </ToolCanvas>
  );
}
