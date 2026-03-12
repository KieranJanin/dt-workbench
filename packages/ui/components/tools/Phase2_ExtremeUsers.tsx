import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase2_ExtremeUsers() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🚀 Extreme Users";

  const [users, setUsers] = useState([
    { id: 1, type: 'Heavy User (Expert)', description: '', needs: '' },
    { id: 2, type: 'Non-User (Rejector)', description: '', needs: '' },
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setUsers(artifact.data.users || []);
      }
    } else {
      setUsers([
        { id: 1, type: 'Heavy User (Expert)', description: '', needs: '' },
        { id: 2, type: 'Non-User (Rejector)', description: '', needs: '' },
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Extreme Users Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { users }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Extreme Users Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { users }, null);
    setActiveArtifactId(id);
  };

  const updateUser = (id: number, field: string, value: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const getExportData = () => ({
    title: "Extreme & Lead Users",
    blocks: [
      ...users.map(u => ({
        type: 'text' as const,
        title: t(u.type),
        content: `Profile Description:\n${u.description || '-'}\n\nExtreme Needs / Hacks:\n${u.needs || '-'}`
      }))
    ]
  });

  return (
    <ToolCanvas
      emoji="🚀"
      title="Extreme & Lead Users"
      description="Explore the needs of edge-case users. Solutions designed for extreme users often benefit the mainstream, unlocking highly innovative ideas."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
        
        {/* Visual bell curve representation mock */}
        <div className="w-full h-32 bg-gradient-to-r from-primary/30 via-muted-bg to-primary/30 rounded-2xl border border-border flex items-end justify-between px-8 pb-4 relative overflow-hidden">
          {/* Curve graphic fake */}
          <div className="absolute inset-0 top-8 opacity-20">
             <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-primary">
               <path d="M0,100 C20,100 30,0 50,0 C70,0 80,100 100,100 L0,100 Z" />
             </svg>
          </div>
          <div className="text-center font-bold text-primary z-10 bg-background/80 px-4 py-1 rounded-full text-sm shadow-sm">{t("Left Edge (Non-User)")}</div>
          <div className="text-center font-bold text-muted-fg/80 z-10 bg-background/80 px-4 py-1 rounded-full text-sm">{t("Mainstream (Average)")}</div>
          <div className="text-center font-bold text-primary z-10 bg-background/80 px-4 py-1 rounded-full text-sm shadow-sm">{t("Right Edge (Heavy User)")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {users.map((user) => (
            <div key={user.id} className="bg-card border-2 border-primary/20 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
               <div className="flex items-center gap-3 border-b border-border pb-3">
                 <div className="bg-primary text-black font-bold px-3 py-1 rounded text-xs uppercase tracking-wider">{t(user.type)}</div>
               </div>
               
               <div className="flex flex-col gap-2">
                 <label className="font-bold text-sm text-foreground">{t("Profile Description")}</label>
                 <p className="text-xs text-muted-fg mb-1 border-l-2 border-primary/50 pl-2">{t("Who is this person? Why do they fall on the extreme edge?")}</p>
                 <textarea 
                   rows={3} 
                   value={user.description} 
                   onChange={e => updateUser(user.id, 'description', e.target.value)} 
                   className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background" 
                 />
               </div>

               <div className="flex flex-col gap-2">
                 <label className="font-bold text-sm text-foreground">{t("Extreme Needs / Hacks")}</label>
                 <p className="text-xs text-muted-fg mb-1 border-l-2 border-primary/50 pl-2">{t("What extreme workarounds or absolute rejections exist here?")}</p>
                 <textarea 
                   rows={4} 
                   value={user.needs} 
                   onChange={e => updateUser(user.id, 'needs', e.target.value)} 
                   className="w-full bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background text-foreground font-medium" 
                 />
               </div>
            </div>
          ))}
        </div>
        
      </div>
    </ToolCanvas>
  );
}
