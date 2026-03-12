import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase4_DotVoting() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🔴 Dot Voting";

  const [items, setItems] = useState([{ id: 1, text: '', votes: 0 }]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setItems(artifact.data.items || [{ id: 1, text: '', votes: 0 }]);
      }
    } else {
      setItems([{ id: 1, text: '', votes: 0 }]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Dot Voting Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { items }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Dot Voting Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { items }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => {
    const sorted = [...items].sort((a,b) => b.votes - a.votes);
    return {
      title: "Dot Voting",
      blocks: [
        {
          type: 'list' as const,
          content: sorted.map(i => `${i.votes} votes: ${i.text || t("Untitled")}`)
        }
      ]
    };
  };

  const addItem = () => setItems([...items, { id: Date.now(), text: '', votes: 0 }]);

  return (
    <ToolCanvas
      emoji="🔴"
      title="Dot Voting"
      description="Democratically select the best concepts by giving team members a limited number of votes (dots) to distribute."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
        {items.sort((a,b) => b.votes - a.votes).map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex flex-col items-center gap-1">
              <button 
                data-html2canvas-ignore="true" 
                onClick={() => setItems(items.map(i => i.id === item.id ? { ...i, votes: i.votes + 1} : i))}
                className="w-10 h-10 rounded-full bg-rose-500 text-white font-bold text-xl hover:scale-110 transition-transform"
              >
                +
              </button>
              <span className="font-bold text-muted-fg text-sm">{item.votes} {t("votes")}</span>
            </div>
            <textarea 
              className="flex-1 bg-transparent resize-none border-b border-border focus:border-primary focus:outline-none p-2 text-lg h-24" 
              placeholder={t("Concept to vote on...")}
              value={item.text}
              onChange={(e) => setItems(items.map(i => i.id === item.id ? { ...i, text: e.target.value} : i))}
            />
          </div>
        ))}
        <button onClick={addItem} className="w-full border-2 border-dashed border-border rounded-xl p-4 font-bold text-muted-fg hover:text-primary hover:border-primary transition-colors">
          + {t("Add Concept")}
        </button>
      </div>
    </ToolCanvas>
  );
}
