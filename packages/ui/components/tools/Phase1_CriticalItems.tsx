import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

interface Item {
  id: number;
  label: string;
  category: 'Must Have' | 'Should Have' | 'Could Have' | 'Won\'t Have';
}

export function Phase1_CriticalItems() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "⚡ Critical Items";

  const [items, setItems] = useState<Item[]>([
    { id: 1, label: '', category: 'Must Have' },
    { id: 2, label: '', category: 'Should Have' },
    { id: 3, label: '', category: 'Could Have' }
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setItems(artifact.data.items || []);
      }
    } else {
      setItems([
        { id: 1, label: '', category: 'Must Have' },
        { id: 2, label: '', category: 'Should Have' },
        { id: 3, label: '', category: 'Could Have' }
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = items[0]?.label ? `${items[0].label} & Others` : 'Critical Items Draft';
    const id = saveArtifact(1, TOOL_NAME, title, { items }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = items[0]?.label ? `${items[0].label} & Others` : 'Critical Items Draft';
    const id = saveArtifact(1, TOOL_NAME, title, { items }, null);
    setActiveArtifactId(id);
  };

  const updateItem = (id: number, field: string, value: string) => {
    setItems(items.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addItem = (category: Item['category']) => {
    setItems([...items, { id: Date.now(), label: '', category }]);
  };

  const getExportData = () => {
    const categories: Item['category'][] = ['Must Have', 'Should Have', 'Could Have', 'Won\'t Have'];
    const blocks: any[] = [];
    
    categories.forEach(cat => {
      blocks.push({ type: 'section_header' as const, content: cat });
      const catItems = items.filter(i => i.category === cat && i.label.trim());
      if (catItems.length > 0) {
        blocks.push({ type: 'list' as const, content: catItems.map(i => i.label) });
      } else {
        blocks.push({ type: 'text' as const, content: "None specified." });
      }
    });

    return {
      title: "Critical Items (MoSCoW)",
      blocks
    };
  };

  const renderCategoryBox = (category: Item['category'], colorClass: string) => {
    const categoryItems = items.filter(i => i.category === category);
    
    return (
      <div className={`border rounded-xl p-5 flex flex-col gap-3 ${colorClass} bg-background/50 h-full`}>
        <div className="flex items-center justify-between border-b pb-2 mb-2 border-inherit">
          <h3 className="font-bold text-lg">{t(category)}</h3>
          <span className="bg-background px-2 py-1 rounded text-xs font-mono font-bold shadow-sm">{categoryItems.length}</span>
        </div>
        
        <div className="flex flex-col gap-2 flex-1">
          {categoryItems.map(item => (
            <div key={item.id} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-current opacity-50 shrink-0" />
              <input
                type="text"
                placeholder={t("Enter critical requirement...")}
                value={item.label}
                onChange={e => updateItem(item.id, 'label', e.target.value)}
                className="bg-transparent border-none w-full focus:outline-none focus:ring-1 focus:ring-current rounded px-1 py-1 text-sm text-foreground"
              />
            </div>
          ))}
          {categoryItems.length === 0 && (
            <div className="text-muted-fg text-sm italic py-2 opacity-60 flex-1 flex items-center justify-center">
              {t("No items added.")}
            </div>
          )}
        </div>
        
        <button 
          data-html2canvas-ignore="true"
          onClick={() => addItem(category)}
          className="mt-auto pt-4 text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity text-left"
        >
          {t("+ Add Item")}
        </button>
      </div>
    );
  };

  return (
    <ToolCanvas
      emoji="⚡"
      title="Critical Items"
      description="Filter out the decisive elements from your observation phase. Prioritize needs using the MoSCoW framework to agree on what is essential."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
        {renderCategoryBox('Must Have', 'border-red-500/30 text-red-600 dark:text-red-400')}
        {renderCategoryBox('Should Have', 'border-amber-500/30 text-amber-600 dark:text-amber-400')}
        {renderCategoryBox('Could Have', 'border-blue-500/30 text-blue-600 dark:text-blue-400')}
        {renderCategoryBox('Won\'t Have', 'border-stone-500/30 text-stone-600 dark:text-stone-400')}
      </div>
    </ToolCanvas>
  );
}
