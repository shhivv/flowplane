import { atom } from 'recoil'

export interface IPlane {
  id: number
  title: string
  plane_type: string
  last_opened: boolean
}

export const loadedPlanesState = atom<IPlane[]>({
  key: 'loadedPlanesState',
  default: []
})

export enum View {
  Create,
  Plane,
}

export const displayedViewState = atom<View>({
  key: 'displayedViewState',
  default: View.Plane
})

export const displayedPlaneState = atom<IPlane | undefined>({
  key: 'displayedPlateState',
  default: undefined
})
