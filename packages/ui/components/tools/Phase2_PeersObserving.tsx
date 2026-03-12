import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase2_PeersObserving() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "👀 Peers Observing";

  const [session, setSession] = useState({
    observerName: '',
    peerName: '',
    setting: '',
    blindspots: '',
    discoveries: ''
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setSession(artifact.data.session || { observerName: '', peerName: '', setting: '', blindspots: '', discoveries: '' });
      }
    } else {
      setSession({ observerName: '', peerName: '', setting: '', blindspots: '', discoveries: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = session.peerName ? `Observed: ${session.peerName}` : 'Peers Observing Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { session }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = session.peerName ? `Observed: ${session.peerName}` : 'Peers Observing Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { session }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Peers Observing Peers",
    blocks: [
      {
        type: 'key-value' as const,
        content: [
          { key: "Observer", value: session.observerName || t("Not specified") },
          { key: "Target Peer", value: session.peerName || t("Not specified") }
        ]
      },
      { type: 'section_header' as const, content: "1. The Setting" },
      { type: 'text' as const, content: session.setting || t("Not specified") },
      { type: 'section_header' as const, content: "2. Covert Blindspots" },
      { type: 'text' as const, content: session.blindspots || t("Not specified") },
      { type: 'section_header' as const, content: "3. Genuine Discoveries" },
      { type: 'text' as const, content: session.discoveries || t("Not specified") }
    ]
  });

  return (
    <ToolCanvas
      emoji="👀"
      title="Peers Observing Peers"
      description="Explore user behavior inconspicuously in their natural habitat. Have peers internally observe each other to eliminate the 'Hawthorne Effect' of formal observation."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-border pb-8">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-xl uppercase ring-4 ring-background shadow-[0_0_0_1px_rgba(0,0,0,0.1)]">O</div>
             <div className="flex-1">
               <label className="text-xs font-bold text-muted-fg uppercase tracking-wider block">{t("Observer")}</label>
               <input type="text" placeholder={t("Your Name")} value={session.observerName} onChange={e => setSession({...session, observerName: e.target.value})} className="w-full bg-transparent border-b border-border focus:border-primary py-1 px-0 text-lg font-medium focus:outline-none" />
             </div>
           </div>

           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center font-bold text-xl uppercase ring-4 ring-background shadow-[0_0_0_1px_rgba(0,0,0,0.1)]">P</div>
             <div className="flex-1">
               <label className="text-xs font-bold text-muted-fg uppercase tracking-wider block">{t("Target Peer (Anonymous)")}</label>
               <input type="text" placeholder={t("e.g. Sales Rep A")} value={session.peerName} onChange={e => setSession({...session, peerName: e.target.value})} className="w-full bg-transparent border-b border-border focus:border-primary py-1 px-0 text-lg font-medium focus:outline-none" />
             </div>
           </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
           <label className="font-bold text-lg text-foreground flex items-center gap-2">{t("1. The Setting")}</label>
           <p className="text-sm text-muted-fg mb-2">{t("Under what conditions was the peer observed naturally?")}</p>
           <input type="text" placeholder={t("e.g. During the weekly pipeline sync on a Zoom call...")} value={session.setting} onChange={e => setSession({...session, setting: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
           <div className="flex flex-col gap-2">
             <label className="font-bold text-lg text-foreground flex items-center gap-2">{t("2. Covert Blindspots")}</label>
             <p className="text-sm text-muted-fg mb-2">{t("What did they do that they likely didn't consciously notice themselves?")}</p>
             <textarea rows={6} placeholder={t("e.g. They sighed heavily every time they had to switch tabs from the CRM to the pricing sheet.")} value={session.blindspots} onChange={e => setSession({...session, blindspots: e.target.value})} className="w-full bg-muted-bg border-transparent focus:border-primary rounded-xl p-4 text-sm resize-none focus:outline-none focus:bg-background" />
           </div>

           <div className="flex flex-col gap-2">
             <label className="font-bold text-lg text-foreground flex items-center gap-2">{t("3. Genuine Discoveries")}</label>
             <p className="text-sm text-muted-fg mb-2">{t("What genuine emotional reactions or workarounds were captured?")}</p>
             <textarea rows={6} placeholder={t("e.g. They are using an unauthorized Excel macro to bypass the mandatory fields.")} value={session.discoveries} onChange={e => setSession({...session, discoveries: e.target.value})} className="w-full bg-primary/10 border-transparent focus:border-primary rounded-xl p-4 text-sm resize-none focus:outline-none focus:bg-primary/5 font-medium text-foreground" />
           </div>
        </div>

      </div>
    </ToolCanvas>
  );
}
