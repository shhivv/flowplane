import { create } from 'zustand';

export enum View {
  Create,
  Plane,
  Settings,
  Clipboard,
  Chat,
}

interface ViewState {
  view?: View;
  setCreate: () => void;
  setPlane: () => void;
  setIntro: () => void;
  setSettings: () => void;
  setClipboard: () => void;
  setChat: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
  view: undefined,
  setCreate: () => set({ view: View.Create }),
  setPlane: () => set({ view: View.Plane }),
  setIntro: () => set({ view: undefined }),
  setSettings: () => set({ view: View.Settings }),
  setClipboard: () => set({ view: View.Clipboard }),
  setChat: () => set({ view: View.Chat }),
}));
