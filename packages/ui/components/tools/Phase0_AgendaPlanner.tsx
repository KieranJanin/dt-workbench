import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase0_AgendaPlanner() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "📅 Agenda Planer"; // Note: Misspelled in tabs

  const [sessions, setSessions] = useState([
    { id: 1, time: '09:00', duration: '30m', title: 'Kickoff & Alignment', owner: '' },
    { id: 2, time: '09:30', duration: '60m', title: 'Problem Discovery', owner: '' },
    { id: 3, time: '10:30', duration: '15m', title: 'Break', owner: '-' },
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setSessions(artifact.data.sessions || []);
      }
    } else {
      setSessions([
        { id: 1, time: '09:00', duration: '30m', title: 'Kickoff & Alignment', owner: '' },
        { id: 2, time: '09:30', duration: '60m', title: 'Problem Discovery', owner: '' },
        { id: 3, time: '10:30', duration: '15m', title: 'Break', owner: '-' },
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = sessions[0]?.title ? `Agenda: ${sessions[0].title}` : 'Agenda Draft';
    const id = saveArtifact(0, TOOL_NAME, title, { sessions }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = sessions[0]?.title ? `Agenda: ${sessions[0].title}` : 'Agenda Draft';
    const id = saveArtifact(0, TOOL_NAME, title, { sessions }, null);
    setActiveArtifactId(id);
  };

  const updateSession = (id: number, field: string, value: string) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSession = () => {
    setSessions([...sessions, { id: Date.now(), time: '', duration: '', title: '', owner: '' }]);
  };

  const getExportData = () => ({
    title: "Agenda Planner",
    blocks: [
      {
        type: 'grid' as const,
        content: [
          ["Start Time", "Duration", "Session Focus", "Owner"],
          ...sessions.map(s => [s.time || "-", s.duration || "-", s.title || "-", s.owner || "-"])
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="📅"
      title="Agenda Planer"
      description="Plan and keep an eye on the most important steps of the preparation. Structure the workshop sequence and assign owners to sessions."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="bg-card w-full rounded-xl border border-border overflow-hidden pb-1">
        <div className="grid grid-cols-12 gap-4 bg-muted-bg p-4 border-b border-border font-semibold text-sm">
          <div className="col-span-2">{t("Start Time")}</div>
          <div className="col-span-2">{t("Duration")}</div>
          <div className="col-span-4">{t("Session Focus")}</div>
          <div className="col-span-4">{t("Owner / Facilitator")}</div>
        </div>
        
        <div className="divide-y divide-border">
          {sessions.map((session) => (
            <div key={session.id} className="grid grid-cols-12 gap-4 p-2 hover:bg-muted-bg/30 transition-colors items-center">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder={t("e.g. 14:00")}
                  value={session.time}
                  onChange={(e) => updateSession(session.id, 'time', e.target.value)}
                  className="w-full bg-transparent border border-transparent hover:border-border focus:border-primary rounded px-2 py-2 focus:outline-none font-mono text-sm"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder={t("e.g. 45m")}
                  value={session.duration}
                  onChange={(e) => updateSession(session.id, 'duration', e.target.value)}
                  className="w-full bg-transparent border border-transparent hover:border-border focus:border-primary rounded px-2 py-2 focus:outline-none text-sm text-muted-fg"
                />
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  placeholder={t("Activity name...")}
                  value={session.title}
                  onChange={(e) => updateSession(session.id, 'title', e.target.value)}
                  className="w-full bg-transparent border border-transparent hover:border-border focus:border-primary rounded px-2 py-2 focus:outline-none font-medium text-sm"
                />
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  placeholder={t("Name...")}
                  value={session.owner}
                  onChange={(e) => updateSession(session.id, 'owner', e.target.value)}
                  className="w-full bg-transparent border border-transparent hover:border-border focus:border-primary rounded px-2 py-2 focus:outline-none text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center" data-html2canvas-ignore="true">
         <button 
           onClick={addSession}
           className="px-4 py-2 bg-muted-bg border border-border rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-colors inline-block"
         >
           {t("+ Add Session Block")}
         </button>
         
         <div className="text-sm text-muted-fg bg-warning/10 text-warning px-3 py-1.5 rounded-md border border-warning/20">
           {t("Tip: Add 'Break' or 'Lunch' as the Session Focus to visually break up the agenda.")}
         </div>
      </div>
    </ToolCanvas>
  );
}
