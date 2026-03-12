import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase2_EmpathyInterview() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🎤 Empathy Interview";

  const [interview, setInterview] = useState({
    interviewee: '',
    date: '',
    role: '',
    introduction: '',
    warmup: '',
    deepdive: '',
    wrapup: '',
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setInterview(artifact.data.interview || { interviewee: '', date: '', role: '', introduction: '', warmup: '', deepdive: '', wrapup: '' });
      }
    } else {
      setInterview({ interviewee: '', date: '', role: '', introduction: '', warmup: '', deepdive: '', wrapup: '' });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = interview.interviewee ? `Interview: ${interview.interviewee}` : 'Empathy Interview Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { interview }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = interview.interviewee ? `Interview: ${interview.interviewee}` : 'Empathy Interview Draft';
    const id = saveArtifact(2, TOOL_NAME, title, { interview }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Empathy Interview Guide",
    blocks: [
      { type: 'section_header' as const, content: "Interview Metadata" },
      {
        type: 'key-value' as const,
        content: [
          { key: "Interviewee Name", value: interview.interviewee || t("Not specified") },
          { key: "Role / Background", value: interview.role || t("Not specified") },
          { key: "Date", value: interview.date || t("Not specified") }
        ]
      },
      { type: 'section_header' as const, content: "Interview Script" },
      { type: 'text' as const, title: "1. Introduction", content: interview.introduction || t("Not specified") },
      { type: 'text' as const, title: "2. Warm-up", content: interview.warmup || t("Not specified") },
      { type: 'text' as const, title: "3. Deep Dive", content: interview.deepdive || t("Not specified") },
      { type: 'text' as const, title: "4. Wrap-up", content: interview.wrapup || t("Not specified") }
    ]
  });

  return (
    <ToolCanvas
      emoji="🎤"
      title="Empathy Interview"
      description="Prepare and conduct interviews to uncover unspoken needs. Use this structured script to guide the conversation from warm-up to deep emotional insights."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted-bg p-6 rounded-2xl border border-border">
           <div>
             <label className="text-xs font-bold text-muted-fg uppercase tracking-wider mb-1 block">{t("Interviewee Name")}</label>
             <input type="text" value={interview.interviewee} onChange={e => setInterview({...interview, interviewee: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
           </div>
           <div>
             <label className="text-xs font-bold text-muted-fg uppercase tracking-wider mb-1 block">{t("Role / Background")}</label>
             <input type="text" value={interview.role} onChange={e => setInterview({...interview, role: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
           </div>
           <div>
             <label className="text-xs font-bold text-muted-fg uppercase tracking-wider mb-1 block">{t("Date")}</label>
             <input type="date" value={interview.date} onChange={e => setInterview({...interview, date: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
           </div>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          
          {/* Section 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-blue-500/20 text-blue-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm">1</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-lg mb-2">{t("Introduction (5 mins)")}</h3>
              <p className="text-sm text-muted-fg mb-3">{t("Set the stage, explain the purpose of the interview, and ask for permission to record.")}</p>
              <textarea rows={2} placeholder={t("Draft your intro script here...")} value={interview.introduction} onChange={e => setInterview({...interview, introduction: e.target.value})} className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none" />
            </div>
          </div>

          {/* Section 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-emerald-500/20 text-emerald-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm">2</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-lg mb-2">{t("Warm-up (10 mins)")}</h3>
              <p className="text-sm text-muted-fg mb-3">{t("Ask broad, easy questions about their life or daily routine to build rapport.")}</p>
              <textarea rows={3} placeholder={t("1. Tell me about a typical day...\n2. What do you enjoy most about your work?")} value={interview.warmup} onChange={e => setInterview({...interview, warmup: e.target.value})} className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none" />
            </div>
          </div>

          {/* Section 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-purple-500/20 text-purple-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm">3</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-lg mb-2">{t("Deep Dive (25 mins)")}</h3>
              <p className="text-sm text-muted-fg mb-3">{t("Ask open-ended questions targeting specific behaviors, pain points, and 'Why's.")}</p>
              <textarea rows={5} placeholder={t("1. Tell me about the last time you tried to [Action]...\n2. How did that make you feel?\n3. Why was that challenging for you?")} value={interview.deepdive} onChange={e => setInterview({...interview, deepdive: e.target.value})} className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none" />
            </div>
          </div>

          {/* Section 4 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-rose-500/20 text-rose-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm">4</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-lg mb-2">{t("Wrap-up (5 mins)")}</h3>
              <p className="text-sm text-muted-fg mb-3">{t("Ask if they have anything else to add and thank them for their time.")}</p>
              <textarea rows={2} placeholder={t("Is there anything else we should know?")} value={interview.wrapup} onChange={e => setInterview({...interview, wrapup: e.target.value})} className="w-full bg-muted-bg border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none" />
            </div>
          </div>

        </div>
      </div>
    </ToolCanvas>
  );
}
