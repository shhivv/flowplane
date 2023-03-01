import { BsPlusLg } from 'react-icons/bs'
import { MdBlurLinear } from 'react-icons/md'
import { GiBlackHoleBolas } from 'react-icons/gi'
import { useRecoilState } from 'recoil'
import {
  loadedPlanesState,
  displayedViewState,
  View,
  type IPlane,
  displayedPlaneState
} from '../state'
import React from 'react'

export default function SideBar () {
  const [loadedPlanes] = useRecoilState(loadedPlanesState)
  const [, setdisplayedView] = useRecoilState(displayedViewState)
  const [, setdisplayedPlane] = useRecoilState(displayedPlaneState)

  const newPlane = () => {
    setdisplayedView(View.Create)
  }

  const changePlane = (plane: IPlane) => {
    setdisplayedView(View.Plane)
    setdisplayedPlane(plane)
  }

  return (
    <div className="h-screen w-1/6 bg-[#111] border-r border-r-neutral-800 p-4 text-sm">
      <div className="py-2">
        <div className="font-heading mb-8 text-lg px-1 text-neutral-300">
          Flowplane
        </div>
        <div className="text-neutral-400">
          {loadedPlanes.map((plane) => (
            <button
              className="flex items-center space-x-3  hover:bg-neutral-900 p-1 w-full  rounded-md"
              key={plane.id}
              onClick={(_) => {
                changePlane(plane)
              }}
            >
              {plane.plane_type === 'linear'
                ? (
                <MdBlurLinear />
                  )
                : (
                <GiBlackHoleBolas />
                  )}{' '}
              <span>{plane.title}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="bottom-0 text-neutral-400 fixed py-3 px-6 flex items-center space-x-4 hover:bg-neutral-900 left-0 w-1/6"
        onClick={newPlane}
      >
        <BsPlusLg /> <span>New plane</span>
      </button>
    </div>
  )
}
