import { invoke } from '@tauri-apps/api';
import { create } from 'zustand';

export interface IPlane {
  id?: number;
  title: string;
  plane_type: string;
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

interface DisplayedPlaneStore {
  plane: IPlane | undefined;
  changePlane: (plane: IPlane) => Promise<void>;
  deletePlane: (plane: IPlane) => Promise<void>;
}

export const useDisplayedPlaneStore = create<DisplayedPlaneStore>((set) => ({
  plane: undefined,
  changePlane: async (plane) => {
    await invoke('set_last_accessed', { planeId: plane.id });
    set({ plane });
  },
  deletePlane: async (plane) => {
    await invoke('delete_plane', { planeId: plane.id });
  }
}));
