import { invoke } from '@tauri-apps/api';
import { create } from 'zustand';

export interface IPlane {
  id?: number;
  title: string;
  plane_type: string;
  last_accessed?: number;
}

interface LoadedPlanesState {
  planes: IPlane[];
  add: (plane: IPlane) => Promise<IPlane>;
  fetch: () => Promise<IPlane[]>;
}

export const useLoadedPlanesStore = create<LoadedPlanesState>((set) => ({
  planes: [],
  add: async (plane) => {
    const createdPlane: IPlane = await invoke('new_plane', {
      title: plane.title,
      planeType: plane.plane_type,
    });

    set((state) => ({ planes: [...state.planes, createdPlane] }));
    return createdPlane;
  },
  fetch: async () => {
    const fetched: IPlane[] = await invoke('get_planes');
    set({ planes: fetched });
    return fetched;
  },
}));

interface DisplayedPlaneStore {
  plane: IPlane | undefined;
  changePlane: (plane: IPlane) => Promise<void>;
}

export const useDisplayedPlaneStore = create<DisplayedPlaneStore>((set) => ({
  plane: undefined,
  changePlane: async (plane) => {
    await invoke('set_last_accessed', { planeId: plane.id });
    set({ plane });
  },
}));
