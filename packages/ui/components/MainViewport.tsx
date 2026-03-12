"use client";

import { usePhaseStore, TabType } from "../../../apps/web/store/usePhaseStore";
import { cn } from "../utils";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useTranslation } from "../lib/i18n";
import { Database } from "lucide-react";
import { Phase0_DesignPrinciples } from "./tools/Phase0_DesignPrinciples";
import { Phase0_StakeholderMap } from "./tools/Phase0_StakeholderMap";
import { Phase0_DefineSuccess } from "./tools/Phase0_DefineSuccess";
import { Phase0_AgendaPlanner } from "./tools/Phase0_AgendaPlanner";
import { Phase1_ProblemStatement } from "./tools/Phase1_ProblemStatement";
import { Phase1_5xWhy } from "./tools/Phase1_5xWhy";
import { Phase1_EmotionalResponse } from "./tools/Phase1_EmotionalResponse";
import { Phase1_TrendAnalysis } from "./tools/Phase1_TrendAnalysis";
import { Phase1_ContextMapping } from "./tools/Phase1_ContextMapping";
import { Phase1_CriticalItems } from "./tools/Phase1_CriticalItems";
import { Phase2_EmpathyInterview } from "./tools/Phase2_EmpathyInterview";
import { Phase2_ExplorativeInterview } from "./tools/Phase2_ExplorativeInterview";
import { Phase2_5WQuestions } from "./tools/Phase2_5WQuestions";
import { Phase2_ExtremeUsers } from "./tools/Phase2_ExtremeUsers";
import { Phase2_AEIOUFramework } from "./tools/Phase2_AEIOUFramework";
import { Phase2_AnalysisBuilder } from "./tools/Phase2_AnalysisBuilder";
import { Phase2_PeersObserving } from "./tools/Phase2_PeersObserving";
import { Phase3_JobsToBeDone } from "./tools/Phase3_JobsToBeDone";
import { Phase3_EmpathyMap } from "./tools/Phase3_EmpathyMap";
import { Phase3_UserPersona } from "./tools/Phase3_UserPersona";
import { Phase3_JourneyMap } from "./tools/Phase3_JourneyMap";
import { Phase3_HowMightWe } from "./tools/Phase3_HowMightWe";
import { Phase3_Storytelling } from "./tools/Phase3_Storytelling";
import { Phase4_Brainstorming } from "./tools/Phase4_Brainstorming";
import { Phase4_2x2Matrix } from "./tools/Phase4_2x2Matrix";
import { Phase4_DotVoting } from "./tools/Phase4_DotVoting";
import { Phase4_Brainwriting } from "./tools/Phase4_Brainwriting";
import { Phase4_SpecialBrainstorming } from "./tools/Phase4_SpecialBrainstorming";
import { Phase4_Analogies } from "./tools/Phase4_Analogies";
import { Phase4_NABCValue } from "./tools/Phase4_NABCValue";
import { Phase4_BlueOcean } from "./tools/Phase4_BlueOcean";
import { Phase5_ExplorationMap } from "./tools/Phase5_ExplorationMap";
import { Phase5_TestablePrototype } from "./tools/Phase5_TestablePrototype";
import { Phase5_ServiceBlueprint } from "./tools/Phase5_ServiceBlueprint";
import { Phase5_DefineMVP } from "./tools/Phase5_DefineMVP";
import { Phase6_TestingSheet } from "./tools/Phase6_TestingSheet";
import { Phase6_FeedbackGrid } from "./tools/Phase6_FeedbackGrid";
import { Phase6_ExperienceTesting } from "./tools/Phase6_ExperienceTesting";
import { Phase6_SolutionInterview } from "./tools/Phase6_SolutionInterview";
import { Phase6_UsabilityTesting } from "./tools/Phase6_UsabilityTesting";
import { Phase6_ABTesting } from "./tools/Phase6_ABTesting";
import { DashboardOverview } from "./DashboardOverview";

// Define the dynamic tabs for each phase
const PHASE_TABS: Record<number, string[]> = {
  0: ['Phase Overview', '🧭 Design Principles', '🗺️ Stakeholder Map', '🎯 Define Success', '📅 Agenda Planer'],
  1: ['Phase Overview', '❗ Problem Statement', '❓ 5x Why', '❤️ Emotional Response', '📈 Trend Analysis', '🌍 Context Mapping', '⚡ Critical Items'],
  2: ['Phase Overview', '🎤 Empathy Interview', '🕵️ Explorative Interview', '🧲 5W Questions', '🚀 Extreme Users', '🏷️ AEIOU Framework', '🧩 Analysis Builder', '👀 Peers Observing'],
  3: ['Phase Overview', '🔨 Jobs to be Done', '🧠 Empathy Map', '👤 User Persona', '🛤️ Journey Map', '💡 How Might We', '📖 Storytelling'],
  4: ['Phase Overview', '⛈️ Brainstorming', '🔲 2x2 Matrix', '🔴 Dot Voting', '📝 Brainwriting', '🎭 Special Brainstorming', '🔄 Analogies', '🏆 NABC Value', '🌊 Blue Ocean'],
  5: ['Phase Overview', '🗺️ Exploration Map', '🛠️ Testable Prototype', '⚙️ Service Blueprint', '💎 Define MVP'],
  6: ['Phase Overview', '📋 Testing Sheet', '📥 Feedback Grid', '🧪 Experience Testing', '🗨️ Solution Interview', '🔍 Usability Testing', '⚖️ A/B Testing'],
  7: ['Phase Overview', '🔭 Vision Cone', '🎬 Create a Pitch', '🖼️ Lean Canvas'],
  8: ['Phase Overview', '🛣️ Roadmap', '🚀 Growth Funnel', '💻 Digital Transform'],
  9: ['Phase Overview', '💭 I Like / I Wish', '⏪ Retrospective', '🎓 Lessons Learned'],
};

const PHASE_DESCRIPTIONS: Record<number, { title: string, focus: string }> = {
  0: { title: "Alignment", focus: "Project kickoff, defining constraints, and team alignment." },
  1: { title: "Understand", focus: "Desk research, competitive analysis, and mapping the known landscape." },
  2: { title: "Observe", focus: "Immersing in the user's world, context, and raw needs through qualitative methods." },
  3: { title: "Point of View", focus: "Meaning-making, synthesizing raw data into concrete problem statements." },
  4: { title: "Ideation", focus: "Divergent thinking and generating a wide volume of concepts." },
  5: { title: "Prototype", focus: "Bringing concepts to life quickly for validation." },
  6: { title: "Test", focus: "Validating prototypes with users and gathering structured feedback." },
  7: { title: "Storytelling", focus: "Packaging the findings and concept into a compelling narrative for stakeholders." },
  8: { title: "Pilot", focus: "Rolling out a real-world test, capturing metrics, and defining the roadmap." },
  9: { title: "Business Model", focus: "Defining the economic engine, go-to-market strategy, and scaling plan." },
};

export function MainViewport() {
  const { activeTab, setActiveTab, activePhase, language, activeArtifactId, setActiveArtifactId, artifacts } = usePhaseStore();
  const { t } = useTranslation(language);
  const currentTabs = PHASE_TABS[activePhase] || ['Phase Overview'];

  // Identify if we are currently editing a loaded artifact
  const editingArtifact = artifacts.find(a => a.id === activeArtifactId);

  // When clicking a tab from the top header
  const handleTabClick = (tab: string) => {
    // If we click a specific tool tab (not Phase Overview), we are creating a New Draft
    if (tab !== 'Phase Overview') {
      setActiveArtifactId(null);
    }
    setActiveTab(tab);
  };

  // Ensure activeTab is valid for the current phase, fallback to Phase Overview if not
  if (!currentTabs.includes(activeTab)) {
    // We do this in a setTimeout to avoid React state updates during render
    setTimeout(() => setActiveTab('Phase Overview'), 0);
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Dynamic Tabs Header */}
      <div className="flex items-center justify-between px-2 border-b border-border bg-muted-bg pt-2 h-12">
        <div className="flex items-center space-x-1 h-full overflow-x-auto no-scrollbar">
          {currentTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-t-md transition-colors h-full whitespace-nowrap",
                activeTab === tab
                  ? "bg-background text-foreground border-x border-t border-border"
                  : "bg-transparent text-muted-fg hover:text-foreground border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              {activeTab === tab && activeArtifactId && editingArtifact?.toolName === tab 
                ? `${t(tab)} (${t("Editing")})` 
                : t(tab)}
            </button>
          ))}
        </div>
        <div className="flex items-center pb-2 pr-2 pl-4 shrink-0 gap-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Viewport Content */}
      <div className="flex-1 overflow-y-auto relative bg-background">
        {activeTab === "Phase Overview" ? (
          <DashboardOverview />
        ) : activeTab === "🧭 Design Principles" ? (
          <Phase0_DesignPrinciples />
        ) : activeTab === "🗺️ Stakeholder Map" ? (
          <Phase0_StakeholderMap />
        ) : activeTab === "🎯 Define Success" ? (
          <Phase0_DefineSuccess />
        ) : activeTab === "📅 Agenda Planer" ? (
          <Phase0_AgendaPlanner />
        ) : activeTab === "❗ Problem Statement" ? (
          <Phase1_ProblemStatement />
        ) : activeTab === "❓ 5x Why" ? (
          <Phase1_5xWhy />
        ) : activeTab === "❤️ Emotional Response" ? (
          <Phase1_EmotionalResponse />
        ) : activeTab === "📈 Trend Analysis" ? (
          <Phase1_TrendAnalysis />
        ) : activeTab === "🌍 Context Mapping" ? (
          <Phase1_ContextMapping />
        ) : activeTab === "⚡ Critical Items" ? (
          <Phase1_CriticalItems />
        ) : activeTab === "🎤 Empathy Interview" ? (
          <Phase2_EmpathyInterview />
        ) : activeTab === "🕵️ Explorative Interview" ? (
          <Phase2_ExplorativeInterview />
        ) : activeTab === "🧲 5W Questions" ? (
          <Phase2_5WQuestions />
        ) : activeTab === "🚀 Extreme Users" ? (
          <Phase2_ExtremeUsers />
        ) : activeTab === "🏷️ AEIOU Framework" ? (
          <Phase2_AEIOUFramework />
        ) : activeTab === "🧩 Analysis Builder" ? (
          <Phase2_AnalysisBuilder />
        ) : activeTab === "👀 Peers Observing" ? (
          <Phase2_PeersObserving />
        ) : activeTab === "🔨 Jobs to be Done" ? (
          <Phase3_JobsToBeDone />
        ) : activeTab === "🧠 Empathy Map" ? (
          <Phase3_EmpathyMap />
        ) : activeTab === "👤 User Persona" ? (
          <Phase3_UserPersona />
        ) : activeTab === "🛤️ Journey Map" ? (
          <Phase3_JourneyMap />
        ) : activeTab === "💡 How Might We" ? (
          <Phase3_HowMightWe />
        ) : activeTab === "📖 Storytelling" ? (
          <Phase3_Storytelling />
        ) : activeTab === "⛈️ Brainstorming" ? (
          <Phase4_Brainstorming />
        ) : activeTab === "🔲 2x2 Matrix" ? (
          <Phase4_2x2Matrix />
        ) : activeTab === "🔴 Dot Voting" ? (
          <Phase4_DotVoting />
        ) : activeTab === "📝 Brainwriting" ? (
          <Phase4_Brainwriting />
        ) : activeTab === "🎭 Special Brainstorming" ? (
          <Phase4_SpecialBrainstorming />
        ) : activeTab === "🔄 Analogies" ? (
          <Phase4_Analogies />
        ) : activeTab === "🏆 NABC Value" ? (
          <Phase4_NABCValue />
        ) : activeTab === "🌊 Blue Ocean" ? (
          <Phase4_BlueOcean />
        ) : activeTab === "🗺️ Exploration Map" ? (
          <Phase5_ExplorationMap />
        ) : activeTab === "🛠️ Testable Prototype" ? (
          <Phase5_TestablePrototype />
        ) : activeTab === "⚙️ Service Blueprint" ? (
          <Phase5_ServiceBlueprint />
        ) : activeTab === "💎 Define MVP" ? (
          <Phase5_DefineMVP />
        ) : activeTab === "📋 Testing Sheet" ? (
          <Phase6_TestingSheet />
        ) : activeTab === "📥 Feedback Grid" ? (
          <Phase6_FeedbackGrid />
        ) : activeTab === "🧪 Experience Testing" ? (
          <Phase6_ExperienceTesting />
        ) : activeTab === "🗨️ Solution Interview" ? (
          <Phase6_SolutionInterview />
        ) : activeTab === "🔍 Usability Testing" ? (
          <Phase6_UsabilityTesting />
        ) : activeTab === "⚖️ A/B Testing" ? (
          <Phase6_ABTesting />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted-bg p-8">
            <div className="text-center max-w-md bg-background p-8 rounded-2xl border border-border shadow-2xl">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-xl mx-auto mb-6 flex items-center justify-center shadow-inner">
                <Database size={28} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">{activeTab}</h2>
              <p className="text-sm text-muted-fg mb-6 leading-relaxed">
                This is a placeholder for a phase-specific UI tool. In a full build, this view would offer specialized forms, canvases, or data grids to help the user complete this specific objective.
              </p>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary/50">
                Phase {activePhase} Module
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
