import { invoke } from '@tauri-apps/api';
import { create } from 'zustand';

interface LoadedClipboardState {
  clips: string[];
  add: (newClip: string) => Promise<void>;
  fetch: () => Promise<{ clips: string[] }>;
}

export const useClipboardStore = create<LoadedClipboardState>((set) => ({
  clips: [],
  add: async (newData) => {
    await invoke('push_to_clipboard', {
      newData,
    });

    set((state) => ({ clips: [newData, ...state.clips] }));
  },
  fetch: async () => {
    const clips: string[] = await invoke('get_clipboard_data');
    set({ clips });
    return {
      clips,
    };
  },
}));
