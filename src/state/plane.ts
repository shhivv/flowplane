import { invoke } from '@tauri-apps/api';
import { create } from 'zustand';

enum PlaneType {
  Linear = 'linear',
  Slate = 'slate',
  Whiteboard = 'whiteboard',
}

export function convertEnum(type: string) {
  if (type === 'linear') {
    return PlaneType.Linear;
  } else if (type === 'slate') {
    return PlaneType.Slate;
  } else {
    return PlaneType.Whiteboard;
  }
}

export interface IPlane {
  id?: number;
  title: string;
  plane_type: PlaneType;
  last_accessed?: number;
  created_at?: number;
}

interface FetchedPlanes {
  planes: IPlane[];
  lastAccessed?: IPlane;
}

interface LoadedPlanesState {
  planes: IPlane[];
  lastAccessed?: IPlane;
  add: (plane: IPlane) => Promise<IPlane>;
  fetch: () => Promise<FetchedPlanes>;
}

interface MainDisplayedPlaneState {
  planeId: number;
  setPlaneId: (planeId: number) => void;
}

export const useMainDisplayedPlane = create<MainDisplayedPlaneState>((set) => ({
  planeId: 0,
  setPlaneId: (planeId: number) => set({ planeId }),
}));

export const useLoadedPlanesStore = create<LoadedPlanesState>((set) => ({
  planes: [],
  lastAccessed: undefined,
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
    const lastAccessed = fetched.sort(
      (a, b) => b.last_accessed! - a.last_accessed!
    )[0];
    set({ planes: fetched, lastAccessed });
    return {
      planes: fetched,
      lastAccessed,
    };
  },
}));
