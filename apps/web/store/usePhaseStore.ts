import { create } from 'zustand';

export type TabType = 'Domo' | 'Miro' | 'Notion' | 'GDocs' | 'GCalendar' | 'Gmail';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface PhaseState {
  // Phase Management
  activePhase: number;
  unlockedPhases: number[];
  setActivePhase: (phase: number) => void;
  unlockPhase: (phase: number) => void;

  // Tab Management
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Toast Management
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Mad-Libs Builder Modal
  activePromptArtifact: string | null;
  setPromptOverlayOpen: (artifactName: string | null) => void;

  // Layout Management
  isLeftSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  isRightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
}

export const usePhaseStore = create<PhaseState>((set) => ({
  activePhase: 0,
  unlockedPhases: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // Unlock all for testing
  setActivePhase: (phase) => set((state) => ({ 
    activePhase: state.unlockedPhases.includes(phase) || phase === 0 ? phase : state.activePhase 
  })),
  unlockPhase: (phase) => set((state) => ({
    unlockedPhases: state.unlockedPhases.includes(phase) ? state.unlockedPhases : [...state.unlockedPhases, phase]
  })),

  activeTab: 'Domo',
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
  toggleRightSidebar: () => set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen }))
}));
