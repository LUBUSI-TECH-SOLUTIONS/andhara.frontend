import { create } from 'zustand';


interface DashboardState {
  createDialogOpen: boolean;
  
  setCreateDialogOpen: (isOpen: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  createDialogOpen: false,
  setCreateDialogOpen: (isOpen) => set({ createDialogOpen: isOpen }),
}));