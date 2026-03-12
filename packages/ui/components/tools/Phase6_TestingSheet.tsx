import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase6_TestingSheet() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "📋 Testing Sheet";

  const [sheet, setSheet] = useState({
    prototype: '',
    tester: '',
    scenario: '',
    tasks: [{ id: 1, text: '' }]
  });

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setSheet(artifact.data.sheet || sheet);
      }
    } else {
      setSheet({ prototype: '', tester: '', scenario: '', tasks: [{ id: 1, text: '' }] });
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Testing Sheet Draft';
    const id = saveArtifact(6, TOOL_NAME, title, { sheet }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Testing Sheet Draft';
    const id = saveArtifact(6, TOOL_NAME, title, { sheet }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => {
    return {
      title: "Testing Sheet",
      blocks: [
        {
          type: 'key-value' as const,
          content: [
            { key: "Prototype", value: sheet.prototype || t("Not specified") },
            { key: "Target Tester Profile", value: sheet.tester || t("Not specified") }
          ]
        },
        {
          type: 'text' as const,
          title: "Testing Scenario / Intro Script",
          content: sheet.scenario || t("-")
        },
        {
          type: 'list' as const,
          title: "Tasks for Tester",
          content: sheet.tasks.map(tsk => tsk.text).filter(txt => txt.trim() !== '').length > 0 
                   ? sheet.tasks.map(tsk => tsk.text).filter(txt => txt.trim() !== '') 
                   : [t("No tasks specified")]
        }
      ]
    };
  };

  const addTask = () => setSheet({...sheet, tasks: [...sheet.tasks, { id: Date.now(), text: '' }]});
  const updateTask = (id: number, text: string) => setSheet({...sheet, tasks: sheet.tasks.map(t => t.id === id ? { ...t, text } : t)});

  return (
    <ToolCanvas
      emoji="📋"
      title="Testing Sheet"
      description="Prepare your testing protocol. Define who you are testing, the scenario to set the context, and the exact tasks you want the user to perform."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <label className="text-sm font-bold text-muted-fg">{t("Prototype Version / Name")}</label>
             <input className="w-full p-3 bg-muted-bg border border-border rounded-lg focus:outline-none focus:border-primary" value={sheet.prototype} onChange={(e) => setSheet({...sheet, prototype: e.target.value})} />
           </div>
           
           <div className="space-y-2">
             <label className="text-sm font-bold text-muted-fg">{t("Target Tester Profile")}</label>
             <input className="w-full p-3 bg-muted-bg border border-border rounded-lg focus:outline-none focus:border-primary" value={sheet.tester} onChange={(e) => setSheet({...sheet, tester: e.target.value})} />
           </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <label className="text-lg font-bold block mb-2">{t("Testing Scenario / Intro Script")}</label>
          <p className="text-xs text-muted-fg mb-4">{t("Write out exactly what you will say to the user to set the stage before they begin.")}</p>
          <textarea 
             className="w-full h-32 bg-muted-bg border border-transparent focus:border-primary rounded-lg p-3 resize-none text-sm focus:outline-none focus:bg-background"
             placeholder={t("Welcome! Today we are testing a new concept for...")}
             value={sheet.scenario}
             onChange={(e) => setSheet({...sheet, scenario: e.target.value})}
          />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <label className="text-lg font-bold block mb-2">{t("Tasks for Tester")}</label>
          <p className="text-xs text-muted-fg mb-4">{t("List the specific actions the user should try to complete without your help.")}</p>
          
          <div className="flex flex-col gap-3">
             {sheet.tasks.map((task, idx) => (
                <div key={task.id} className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">{idx + 1}</div>
                   <input className="flex-1 bg-muted-bg border border-border rounded-lg p-2 text-sm focus:outline-none focus:border-primary" value={task.text} onChange={e => updateTask(task.id, e.target.value)} placeholder={t("Task description...")}/>
                </div>
             ))}
             <button onClick={addTask} className="text-sm text-primary font-bold self-start mt-2 hover:underline">+ {t("Add Task")}</button>
          </div>
        </div>

      </div>
    </ToolCanvas>
  );
}
