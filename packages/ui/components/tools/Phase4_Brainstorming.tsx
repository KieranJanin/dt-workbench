import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase4_Brainstorming() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "⛈️ Brainstorming";

  const [ideas, setIdeas] = useState([{ id: 1, text: '', author: '' }]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setIdeas(artifact.data.ideas || [{ id: 1, text: '', author: '' }]);
      }
    } else {
      setIdeas([{ id: 1, text: '', author: '' }]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Brainstorming Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { ideas }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Brainstorming Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { ideas }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Brainstorming",
    blocks: [
      {
        type: 'list' as const,
        content: ideas.map(idea => `${idea.text || t("Untitled")} (${idea.author || t("Anonymous")})`)
      }
    ]
  });

  const addIdea = () => setIdeas([...ideas, { id: Date.now(), text: '', author: '' }]);

  return (
    <ToolCanvas
      emoji="⛈️"
      title="Brainstorming"
      description="Generate a high volume of ideas to address your 'How Might We' question. Go for quantity, defer judgment, and encourage wild ideas."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full flex flex-col gap-4">
        {ideas.map((idea, idx) => (
          <div key={idea.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
            <span className="font-bold text-muted-fg w-6">{idx + 1}.</span>
            <input 
              className="flex-1 bg-transparent border-b border-border focus:border-primary focus:outline-none p-2" 
              placeholder={t("Idea Description")}
              value={idea.text}
              onChange={(e) => {
                const newIdeas = [...ideas];
                newIdeas[idx].text = e.target.value;
                setIdeas(newIdeas);
              }}
            />
            <input 
              className="w-32 bg-transparent border-b border-border focus:border-primary focus:outline-none p-2 text-sm text-muted-fg"
              placeholder={t("Author")}
              value={idea.author}
              onChange={(e) => {
                const newIdeas = [...ideas];
                newIdeas[idx].author = e.target.value;
                setIdeas(newIdeas);
              }}
            />
          </div>
        ))}
        <button onClick={addIdea} className="w-full border-2 border-dashed border-border rounded-xl p-4 font-bold text-muted-fg hover:text-primary hover:border-primary transition-colors">
          + {t("Add Idea")}
        </button>
      </div>
    </ToolCanvas>
  );
}
