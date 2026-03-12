import React, { useState } from 'react';
import { ToolCanvas } from '../ToolCanvas';
import { usePhaseStore } from '../../../../apps/web/store/usePhaseStore';
import { useTranslation } from '../../lib/i18n';

type StakeholderRole = 'Responsible' | 'Accountable' | 'Consulted' | 'Informed';

interface Stakeholder {
  id: number;
  name: string;
  role: StakeholderRole;
  influence: 'High' | 'Medium' | 'Low';
  notes: string;
}

export function Phase0_StakeholderMap() {
  const { language, activeArtifactId, artifacts, saveArtifact, setActiveArtifactId } = usePhaseStore();
  const { t } = useTranslation(language);
  const TOOL_NAME = "🗺️ Stakeholder Map";

  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    { id: 1, name: '', role: 'Accountable', influence: 'High', notes: '' },
    { id: 2, name: '', role: 'Responsible', influence: 'High', notes: '' },
    { id: 3, name: '', role: 'Consulted', influence: 'Medium', notes: '' },
  ]);

  React.useEffect(() => {
    if (activeArtifactId) {
      const artifact = artifacts.find(a => a.id === activeArtifactId);
      if (artifact && artifact.toolName === TOOL_NAME) {
        setStakeholders(artifact.data.stakeholders || []);
      }
    } else {
      setStakeholders([
        { id: 1, name: '', role: 'Accountable', influence: 'High', notes: '' },
        { id: 2, name: '', role: 'Responsible', influence: 'High', notes: '' },
        { id: 3, name: '', role: 'Consulted', influence: 'Medium', notes: '' },
      ]);
    }
  }, [activeArtifactId, artifacts]);

  const onSave = () => {
    const title = stakeholders[0]?.name ? `${stakeholders[0].name} & Others` : 'Stakeholder Map Draft';
    const id = saveArtifact(0, TOOL_NAME, title, { stakeholders }, activeArtifactId);
    setActiveArtifactId(id);
  };

  const onSaveAsNew = () => {
    const title = stakeholders[0]?.name ? `${stakeholders[0].name} & Others` : 'Stakeholder Map Draft';
    const id = saveArtifact(0, TOOL_NAME, title, { stakeholders }, null);
    setActiveArtifactId(id);
  };

  const updateStakeholder = (id: number, field: keyof Stakeholder, value: string) => {
    setStakeholders(stakeholders.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addStakeholder = () => {
    setStakeholders([...stakeholders, { id: Date.now(), name: '', role: 'Informed', influence: 'Low', notes: '' }]);
  };

  const getExportData = () => ({
    title: "Stakeholder Map & RACI",
    blocks: [
      {
        type: 'grid' as const,
        content: [
          ["Name / Group", "RACI Role", "Influence", "Impact / Needs"],
          ...stakeholders.filter(s => s.name || s.notes).map(s => [
            s.name || "-", 
            s.role, 
            s.influence, 
            s.notes || "-"
          ])
        ]
      }
    ]
  });

  return (
    <ToolCanvas
      emoji="🗺️"
      title="Stakeholder Map & RACI"
      description="Identify crucial internal and external stakeholders, map their influence, and define their involvement using the RACI framework."
      exportData={getExportData()}
      onSaveFn={onSave}
      onSaveAsNewFn={onSaveAsNew}
    >
      <div className="overflow-x-auto border border-border rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted-bg border-b border-border">
              <th className="p-4 font-semibold w-1/4">{t("Name / Group")}</th>
              <th className="p-4 font-semibold w-1/5">{t("RACI Role")}</th>
              <th className="p-4 font-semibold w-1/6">{t("Influence")}</th>
              <th className="p-4 font-semibold w-full">{t("Impact / Needs")}</th>
            </tr>
          </thead>
          <tbody>
            {stakeholders.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted-bg/30">
                <td className="p-3">
                  <input
                    type="text"
                    placeholder={t("E.g. Engineering Lead")}
                    value={s.name}
                    onChange={(e) => updateStakeholder(s.id, 'name', e.target.value)}
                    className="bg-transparent border border-transparent hover:border-border focus:border-primary rounded px-2 py-1 w-full focus:outline-none"
                  />
                </td>
                <td className="p-3">
                  <select
                    value={s.role}
                    onChange={(e) => updateStakeholder(s.id, 'role', e.target.value as StakeholderRole)}
                    className="bg-transparent border border-transparent hover:border-border focus:border-primary rounded px-2 py-1 w-full focus:outline-none cursor-pointer"
                  >
                    <option value="Responsible">{t("Responsible (R)")}</option>
                    <option value="Accountable">{t("Accountable (A)")}</option>
                    <option value="Consulted">{t("Consulted (C)")}</option>
                    <option value="Informed">{t("Informed (I)")}</option>
                  </select>
                </td>
                <td className="p-3">
                  <select
                    value={s.influence}
                    onChange={(e) => updateStakeholder(s.id, 'influence', e.target.value)}
                    className="bg-transparent border border-transparent hover:border-border focus:border-primary rounded px-2 py-1 w-full focus:outline-none cursor-pointer"
                  >
                    <option value="High">{t("🔴 High")}</option>
                    <option value="Medium">{t("🟡 Medium")}</option>
                    <option value="Low">{t("🟢 Low")}</option>
                  </select>
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    placeholder={t("Brief notes on their needs...")}
                    value={s.notes}
                    onChange={(e) => updateStakeholder(s.id, 'notes', e.target.value)}
                    className="bg-transparent border border-transparent hover:border-border focus:border-primary rounded px-2 py-1 w-full focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button 
        data-html2canvas-ignore="true"
        onClick={addStakeholder}
        className="mt-4 px-4 py-2 bg-muted-bg border border-border rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-colors inline-block"
      >
        {t("+ Add Stakeholder")}
      </button>
    </ToolCanvas>
  );
}
