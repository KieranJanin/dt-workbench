import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type TabType = 'Domo' | 'Miro' | 'Notion' | 'GDocs' | 'GCalendar' | 'Gmail';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface SettingsState {
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  industry: string;
  gcpCredentials: string;
  notionKey: string;
  notionRootPageId: string;
  miroToken: string;
  miroBoardId: string;
  neo4jUri: string;
  gdocsUrl: string;
  gcalendarUrl: string;
  gmailUrl: string;
  teamMembers: string;
}

export interface PhaseTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Artifact {
  id: string;
  phase: number;
  toolName: string;
  title: string;
  customTitle?: string;
  data: any;
  updatedAt: number;
  createdAt: number;
  isArchived: boolean;
  isPinned: boolean;
}

interface PhaseState {
  // Phase Management
  activePhase: number;
  unlockedPhases: number[];
  setActivePhase: (phase: number) => void;
  unlockPhase: (phase: number) => void;

  // Task Checklist Management
  phaseTasks: Record<number, PhaseTask[]>;
  toggleTaskCompletion: (phase: number, taskId: string) => void;

  // Tab Management
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Toast Management
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Mad-Libs Builder Modal (Can be removed later if completely unused)
  activePromptArtifact: string | null;
  setPromptOverlayOpen: (artifactName: string | null) => void;

  // Layout Management
  isLeftSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  isRightSidebarOpen: boolean;
  toggleRightSidebar: () => void;

  // Language Management (i18n)
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;

  // Settings
  settings: SettingsState;
  updateSettings: (settings: Partial<SettingsState>) => void;

  // Artifact Management
  artifacts: Artifact[];
  activeArtifactId: string | null;
  setActiveArtifactId: (id: string | null) => void;
  saveArtifact: (phase: number, toolName: string, title: string, data: any, existingId?: string) => string;
  deleteArtifact: (id: string) => void;
  toggleArchiveArtifact: (id: string) => void;
  togglePinArtifact: (id: string) => void;
  renameArtifact: (id: string, newTitle: string) => void;
}

const INITIAL_TASKS: Record<number, PhaseTask[]> = {
  0: [
    { id: 't0_1', title: 'Draft Project Charter', completed: false },
    { id: 't0_2', title: 'Schedule Kickoff Meeting', completed: false },
    { id: 't0_3', title: 'Define Success Metrics', completed: false },
  ],
  1: [
    { id: 't1_1', title: 'Identify Target Personas', completed: false },
    { id: 't1_2', title: 'Conduct User Interviews', completed: false },
    { id: 't1_3', title: 'Draft Empathy Maps', completed: false },
  ],
  2: [
    { id: 't2_1', title: 'Synthesize Interview Feedback', completed: false },
    { id: 't2_2', title: 'Refine Problem Statement', completed: false },
    { id: 't2_3', title: 'Create "How Might We?" questions', completed: false },
  ],
  3: [
    { id: 't3_1', title: 'Host Brainstorming Session', completed: false },
    { id: 't3_2', title: 'Cluster Ideas by Theme', completed: false },
    { id: 't3_3', title: 'Prioritize using Matrix', completed: false },
  ],
  4: [
    { id: 't4_1', title: 'Define MVP Scope', completed: false },
    { id: 't4_2', title: 'Draft Storyboards', completed: false },
    { id: 't4_3', title: 'Create Low-Fi Wireframes', completed: false },
  ],
  5: [
    { id: 't5_1', title: 'Write Usability Testing Script', completed: false },
    { id: 't5_2', title: 'Conduct User Tests', completed: false },
    { id: 't5_3', title: 'Capture Feedback in Grid', completed: false },
  ],
  // Fallbacks for MVP representation
  6: [{ id: 't6_1', title: 'Draft User Stories', completed: false }],
  7: [{ id: 't7_1', title: 'Executive Review', completed: false }],
  8: [{ id: 't8_1', title: 'Create Playbook', completed: false }],
  9: [{ id: 't9_1', title: 'Project Post-Mortem', completed: false }],
};

export const usePhaseStore = create<PhaseState>()(
  persist(
    (set) => ({
      activePhase: 0,
      unlockedPhases: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // Unlock all for testing
      
      phaseTasks: INITIAL_TASKS,
      toggleTaskCompletion: (phase, taskId) => set((state) => {
        const tasks = state.phaseTasks[phase] || [];
        const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        return { phaseTasks: { ...state.phaseTasks, [phase]: updatedTasks } };
      }),

      setActivePhase: (phase) => set((state) => ({ 
        activePhase: state.unlockedPhases.includes(phase) || phase === 0 ? phase : state.activePhase,
        activeTab: 'Phase Overview' // Automatically switch back to the overview on phase change
      })),
      unlockPhase: (phase) => set((state) => ({
        unlockedPhases: state.unlockedPhases.includes(phase) ? state.unlockedPhases : [...state.unlockedPhases, phase]
      })),

      activeTab: 'Phase Overview',
      setActiveTab: (tab) => set({ activeTab: tab }),

      toasts: [],
      addToast: (toast) => set((state) => {
        const id = Math.random().toString(36).substring(2, 9);
        return { toasts: [...state.toasts, { ...toast, id }] };
      }),
      removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
      
      activePromptArtifact: null,
      setPromptOverlayOpen: (artifactName) => set({ activePromptArtifact: artifactName }),

      isLeftSidebarOpen: true,
      toggleLeftSidebar: () => set((state) => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen })),
      isRightSidebarOpen: true,
      toggleRightSidebar: () => set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),

      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      settings: {
        projectName: "Unified dt.workbench MVP",
        projectDescription: "A platform for design thinking practitioners.",
        targetAudience: "UX Designers, PMs, Engineers",
        industry: "Software / SaaS",
        gcpCredentials: "",
        notionKey: "",
        notionRootPageId: "",
        miroToken: "",
        miroBoardId: "",
        neo4jUri: "",
        gdocsUrl: "",
        gcalendarUrl: "",
        gmailUrl: "",
        teamMembers: "Not specified",
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      // Artifact Management Implementation
      artifacts: [],
      activeArtifactId: null,
      setActiveArtifactId: (id) => set({ activeArtifactId: id }),
      saveArtifact: (phase: number, toolName: string, title: string, data: any, existingId?: string) => {
        const id = existingId || uuidv4();
        const now = Date.now();
        set((state) => {
          const index = state.artifacts.findIndex(a => a.id === id);
          if (index >= 0) {
            // Update existing
            const newArtifacts = [...state.artifacts];
            newArtifacts[index] = {
              ...newArtifacts[index],
              title,
              data,
              updatedAt: now
            };
            return { artifacts: newArtifacts, activeArtifactId: id };
          } else {
            // Create new
            const newArtifact: Artifact = {
              id,
              phase,
              toolName,
              title,
              data,
              createdAt: now,
              updatedAt: now,
              isArchived: false,
              isPinned: false
            };
            return { artifacts: [...state.artifacts, newArtifact], activeArtifactId: id };
          }
        });
        return id;
      },
      deleteArtifact: (id) => set((state) => ({
        artifacts: state.artifacts.filter(a => a.id !== id),
        activeArtifactId: state.activeArtifactId === id ? null : state.activeArtifactId
      })),
      toggleArchiveArtifact: (id) => set((state) => ({
        artifacts: state.artifacts.map(a => a.id === id ? { ...a, isArchived: !a.isArchived, isPinned: false } : a)
      })),
      togglePinArtifact: (id) => set((state) => ({
        artifacts: state.artifacts.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a)
      })),
      renameArtifact: (id, newTitle) => set((state) => ({
        artifacts: state.artifacts.map(a => a.id === id ? { ...a, customTitle: newTitle, updatedAt: Date.now() } : a)
      })),
    }),
    {
      name: 'dt-workbench-storage',
    }
  )
);
