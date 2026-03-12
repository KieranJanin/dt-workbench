import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase4_SpecialBrainstorming() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🎭 Special Brainstorming";

  const [sections, setSections] = useState([
    { id: 'reverse', title: 'Reverse Thinking', prompt: 'How could we completely ruin the user experience?', ideas: '' },
    { id: 'million', title: 'Unlimited Budget', prompt: 'If we had $10M and 100 engineers, how would we solve this?', ideas: '' },
    { id: 'zero', title: 'No Budget', prompt: 'If we had $0 and 1 day, how would we solve this?', ideas: '' },
    { id: 'spaceship', title: 'Sci-Fi Scenario', prompt: 'If we had alien technology, how would this work?', ideas: '' },
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setSections(artifact.data.sections || sections);
      }
    } else {
      setSections([
        { id: 'reverse', title: 'Reverse Thinking', prompt: 'How could we completely ruin the user experience?', ideas: '' },
        { id: 'million', title: 'Unlimited Budget', prompt: 'If we had $10M and 100 engineers, how would we solve this?', ideas: '' },
        { id: 'zero', title: 'No Budget', prompt: 'If we had $0 and 1 day, how would we solve this?', ideas: '' },
        { id: 'spaceship', title: 'Sci-Fi Scenario', prompt: 'If we had alien technology, how would this work?', ideas: '' }
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = 'Special Brainstorming Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { sections }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = 'Special Brainstorming Draft';
    const id = saveArtifact(4, TOOL_NAME, title, { sections }, null);
    setActiveArtifactId(id);
  };

  const getExportData = () => ({
    title: "Special Brainstorming",
    blocks: sections.map(s => ({
      type: 'text' as const,
      title: `${t(s.title)}: ${t(s.prompt)}`,
      content: s.ideas || t("-"),
    }))
  });

  const updateSection = (id: string, text: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, ideas: text } : s));
  };

  return (
    <ToolCanvas
      emoji="🎭"
      title="Special Brainstorming"
      description="Break out of conventional thinking patterns by applying extreme constraints or reversing the problem."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(section => (
          <div key={section.id} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-64">
             <h3 className="font-bold text-lg text-foreground">{t(section.title)}</h3>
             <p className="text-xs text-muted-fg mb-4">{t(section.prompt)}</p>
             <textarea 
               className="w-full flex-1 bg-muted-bg border border-transparent focus:border-primary rounded-lg p-3 text-sm resize-none focus:outline-none focus:bg-background transition-colors"
               placeholder={t("Jot down extreme ideas here...")}
               value={section.ideas}
               onChange={(e) => updateSection(section.id, e.target.value)}
             />
          </div>
        ))}
      </div>
    </ToolCanvas>
  );
}
