import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase2_ExplorativeInterview() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🕵️ Explorative Interview";

  const [notes, setNotes] = useState([
    { id: 1, topic: 'Daily Routine', quote: '', meaning: '' },
    { id: 2, topic: 'Values & Beliefs', quote: '', meaning: '' },
    { id: 3, topic: 'Workarounds', quote: '', meaning: '' },
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setNotes(artifact.data.notes || []);
      }
    } else {
      setNotes([
        { id: 1, topic: 'Daily Routine', quote: '', meaning: '' },
        { id: 2, topic: 'Values & Beliefs', quote: '', meaning: '' },
        { id: 3, topic: 'Workarounds', quote: '', meaning: '' },
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Explorative Interview Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { notes }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Explorative Interview Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { notes }, null);
    setActiveArtifactId(id);
  };

  const updateNote = (id: number, field: string, value: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const addNote = () => {
    setNotes([...notes, { id: Date.now(), topic: '', quote: '', meaning: '' }]);
  };

  const getExportData = () => ({
    title: "Explorative Interview",
    blocks: [
      ...notes.filter(n => n.topic || n.quote || n.meaning).map(n => ({
        type: 'text' as const,
        title: n.topic || t("Untitled Topic"),
        content: `Exact Quote:\n"${n.quote || '-'}"\n\nMeaning:\n${n.meaning || '-'}`
      }))
    ]
  });

  return (
    <ToolCanvas
      emoji="🕵️"
      title="Explorative Interview"
      description="Capture deep dives into the everyday lives, values, and beliefs of users. Document exact quotes to preserve the raw voice of the customer."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {notes.map(note => (
             <div key={note.id} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder={t("Topic / Theme")} 
                  value={note.topic}
                  onChange={e => updateNote(note.id, 'topic', e.target.value)}
                  className="w-full bg-transparent border-b-2 border-border focus:border-primary font-bold px-1 py-1 focus:outline-none text-lg"
                />
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-fg uppercase tracking-wider">{t("Exact Quote (What they said)")}</label>
                  <textarea 
                    rows={3} 
                    placeholder={t("\"I usually just write my password on a sticky note because the system logs me out too fast...\"")} 
                    value={note.quote}
                    onChange={e => updateNote(note.id, 'quote', e.target.value)}
                    className="w-full bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary italic text-foreground"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-muted-fg uppercase tracking-wider">{t("Meaning (What it implies)")}</label>
                  <textarea 
                    rows={3} 
                    placeholder={t("Security policies are actually causing insecure behavior due to bad UX.")} 
                    value={note.meaning}
                    onChange={e => updateNote(note.id, 'meaning', e.target.value)}
                    className="w-full bg-muted-bg border border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background"
                  />
                </div>
             </div>
           ))}
           
           <button 
             data-html2canvas-ignore="true"
             onClick={addNote}
             className="rounded-xl border-2 border-dashed border-border flex items-center justify-center p-5 min-h-[300px] font-bold text-muted-fg hover:text-primary hover:border-primary transition-colors h-full"
           >
             {t("+ Add Insight Card")}
           </button>
        </div>
      </div>
    </ToolCanvas>
  );
}
