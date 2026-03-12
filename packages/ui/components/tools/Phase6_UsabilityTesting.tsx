import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase6_UsabilityTesting() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🔍 Usability Testing";

  const [tasks, setTasks] = useState([
    { id: 1, task: 'Sign up for a new account', completion: 'Yes', time: '1m 20s', notes: '' },
    { id: 2, task: 'Find the pricing page', completion: 'No', time: '-', notes: 'User clicked on Support instead' }
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setTasks(artifact.data.tasks || tasks);
      }
    } else {
      setTasks([
        { id: 1, task: 'Sign up for a new account', completion: 'Yes', time: '1m 20s', notes: '' },
        { id: 2, task: 'Find the pricing page', completion: 'No', time: '-', notes: 'User clicked on Support instead' }
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Usability Testing Draft';
    const id = saveArtifact(6, TOOL_NAME, title, { tasks }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Usability Testing Draft';
    const id = saveArtifact(6, TOOL_NAME, title, { tasks }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => {
    const successCount = tasks.filter(t => t.completion === 'Yes').length;
    const rate = tasks.length > 0 ? Math.round((successCount / tasks.length) * 100) : 0;
    
    return {
      title: "Usability Testing Results",
      blocks: [
        {
          type: 'key-value' as const,
          content: [
            { key: "Overall Task Success Rate", value: `${rate}% (${successCount}/${tasks.length})` }
          ]
        },
        {
          type: 'grid' as const,
          content: [
            ["Task", "Completed?", "Time", "Notes"],
            ...tasks.map(taskObj => [taskObj.task || t("Untitled Task"), taskObj.completion, taskObj.time, taskObj.notes || t("-")])
          ]
        }
      ]
    };
  };

  const updateTask = (id: number, field: string, val: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: val } : t));
  };
  
  const addTask = () => setTasks([...tasks, { id: Date.now(), task: '', completion: 'Partial', time: '', notes: '' }]);

  return (
    <ToolCanvas
      emoji="🔍"
      title="Usability Testing"
      description="Record specific task completion rates, time on task, and friction points observed during a usability testing session."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full flex flex-col gap-6 overflow-x-auto">
        
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[3fr_1fr_1fr_3fr] gap-4 mb-2 px-4">
             <div className="text-xs font-bold text-muted-fg uppercase">{t("Task Description")}</div>
             <div className="text-xs font-bold text-muted-fg uppercase">{t("Completed?")}</div>
             <div className="text-xs font-bold text-muted-fg uppercase">{t("Time")}</div>
             <div className="text-xs font-bold text-muted-fg uppercase">{t("Observations / Notes")}</div>
          </div>
          
          <div className="flex flex-col gap-3">
             {tasks.map(tObj => (
                <div key={tObj.id} className="grid grid-cols-[3fr_1fr_1fr_3fr] gap-4 bg-muted-bg p-2 rounded-lg items-start border border-border">
                   <textarea 
                     className="w-full bg-background border border-transparent focus:border-primary rounded p-2 text-sm resize-none h-16 focus:outline-none" 
                     value={tObj.task} 
                     onChange={e => updateTask(tObj.id, 'task', e.target.value)} 
                     placeholder={t("e.g. Find the return policy")}
                   />
                   <select 
                     className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:border-primary h-10"
                     value={tObj.completion}
                     onChange={e => updateTask(tObj.id, 'completion', e.target.value)}
                   >
                     <option value="Yes">{t("Yes")}</option>
                     <option value="No">{t("No")}</option>
                     <option value="Partial">{t("Partial")}</option>
                   </select>
                   <input 
                     className="w-full bg-background border border-transparent focus:border-primary rounded p-2 text-sm focus:outline-none h-10" 
                     value={tObj.time} 
                     onChange={e => updateTask(tObj.id, 'time', e.target.value)} 
                     placeholder="xx:xx"
                   />
                   <textarea 
                     className="w-full bg-background border border-transparent focus:border-primary rounded p-2 text-sm resize-none h-16 focus:outline-none" 
                     value={tObj.notes} 
                     onChange={e => updateTask(tObj.id, 'notes', e.target.value)} 
                     placeholder={t("User looked in the footer but it was in the header...")}
                   />
                </div>
             ))}
          </div>

          <button onClick={addTask} className="mt-4 border-2 border-dashed border-border rounded-lg py-3 px-6 font-bold text-muted-fg hover:text-primary hover:border-primary transition-colors text-sm">
            + {t("Add Task Recording")}
          </button>
        </div>

      </div>
    </ToolCanvas>
  );
}
