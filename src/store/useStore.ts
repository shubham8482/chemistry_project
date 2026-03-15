import { create } from 'zustand';

interface AppState {
    currentMission: string | null;
    setCurrentMission: (mission: string) => void;
}

export const useStore = create<AppState>((set) => ({
    currentMission: null,
    setCurrentMission: (mission) => set({ currentMission: mission }),
}));
