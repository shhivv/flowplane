import { create } from 'zustand';

export enum View {
  Create,
  Plane,
}

interface ViewState {
  view?: View;
  setCreate: () => void;
  setPlane: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
  view: undefined,
  setCreate: () => set({ view: View.Create }),
  setPlane: () => set({ view: View.Plane }),
}));
