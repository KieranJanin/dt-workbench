import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

export function Phase1_EmotionalResponse() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "❤️ Emotional Response";

  const [productName, setProductName] = useState('');
  
  // Matrix of emotion cards
  const defaultCards = () => [
    { emotion: 'Confused', count: 0, category: 'negative' },
    { emotion: 'Frustrated', count: 0, category: 'negative' },
    { emotion: 'Overwhelmed', count: 0, category: 'negative' },
    { emotion: 'Bored', count: 0, category: 'negative' },
    { emotion: 'Impatient', count: 0, category: 'negative' },
    
    { emotion: 'Intrigued', count: 0, category: 'neutral' },
    { emotion: 'Focused', count: 0, category: 'neutral' },
    { emotion: 'Indifferent', count: 0, category: 'neutral' },
    
    { emotion: 'Delighted', count: 0, category: 'positive' },
    { emotion: 'Empowered', count: 0, category: 'positive' },
    { emotion: 'Relieved', count: 0, category: 'positive' },
    { emotion: 'Trusting', count: 0, category: 'positive' }
  ];

  const [cards, setCards] = useState(defaultCards());

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setProductName(artifact.data.productName || '');
        setCards(artifact.data.cards || defaultCards());
      }
    } else {
      setProductName('');
      setCards(defaultCards());
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = productName ? `Testing: ${productName}` : 'Emotional Response Draft';
    const id = saveArtifact(1, TOOL_NAME, title, { productName, cards }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = productName ? `Testing: ${productName}` : 'Emotional Response Draft';
    const id = saveArtifact(1, TOOL_NAME, title, { productName, cards }, null);
    setActiveArtifactId(id);
  };

  const incrementCount = (idx: number) => {
    const newCards = [...cards];
    newCards[idx].count += 1;
    setCards(newCards);
  };
  
  const decrementCount = (idx: number) => {
    const newCards = [...cards];
    if (newCards[idx].count > 0) newCards[idx].count -= 1;
    setCards(newCards);
  };

  const getExportData = () => ({
    title: "Emotional Response",
    blocks: [
      { type: 'section_header' as const, content: `Testing Target: ${productName || t("Not specified")}` },
      { type: 'section_header' as const, content: "Emotional Sentiments" },
      {
        type: 'grid' as const,
        content: [
          ["Emotion", "Category", "Votes"],
          ...cards.filter(c => c.count > 0).sort((a, b) => b.count - a.count).map(c => [
            c.emotion, 
            c.category.charAt(0).toUpperCase() + c.category.slice(1), 
            c.count.toString()
          ])
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="❤️"
      title="Emotional Response Cards"
      description="Learn more about competing products, brands, and experiences. Collect statements on strategy, aesthetics, and speed by asking users to select adjectives describing their feelings."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4 bg-muted-bg p-4 rounded-xl border border-border w-full max-w-sm">
           <span className="font-bold text-sm whitespace-nowrap">{t("Testing Target:")}</span>
           <input 
             type="text" 
             placeholder={t("Product / Brand Name")} 
             value={productName}
             onChange={e => setProductName(e.target.value)}
             className="w-full bg-background border border-border rounded px-3 py-1.5 focus:outline-none focus:border-primary text-sm font-semibold"
           />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((card, idx) => {
            const getBgColor = () => {
              if (card.category === 'negative') return 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400';
              if (card.category === 'positive') return 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400';
              return 'bg-muted-bg border-border text-foreground';
            };

            return (
              <div 
                key={card.emotion} 
                className={`border rounded-xl p-4 flex flex-col justify-between items-center text-center aspect-square transition-all ${getBgColor()}`}
              >
                <div className="flex-1 flex items-center justify-center font-bold text-lg">
                  {t(card.emotion)}
                </div>
                
                <div className="flex items-center gap-3 bg-background/50 backdrop-blur px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10" data-html2canvas-ignore="true">
                  <button onClick={() => decrementCount(idx)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 font-bold">-</button>
                  <span className="font-mono font-bold w-4 text-center">{card.count}</span>
                  <button onClick={() => incrementCount(idx)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 font-bold">+</button>
                </div>
                
                {/* Print-only count display */}
                <div className="hidden print-mode-block font-mono font-bold text-2xl mt-4">
                  {card.count > 0 ? `${t("Count:")} ${card.count}` : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolCanvas>
  );
}
