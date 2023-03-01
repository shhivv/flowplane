import { MdBlurLinear } from 'react-icons/md'
import { GiBlackHoleBolas } from 'react-icons/gi'
import { useRecoilState, atom } from 'recoil'
import { twMerge } from 'tailwind-merge'
import {
  displayedPlaneState,
  displayedViewState,
  loadedPlanesState,
  View
} from '../state'
import React from 'react'

const selectedState = atom({
  key: 'selectedState',
  default: 'linear'
})

const titleState = atom({
  key: 'titleState',
  default: ''
})

export default function NewPlane () {
  const [selectedType, setSelectedType] = useRecoilState(selectedState)
  const [, setLoadedPlanes] = useRecoilState(loadedPlanesState)
  const [, setdisplayedPlane] = useRecoilState(displayedPlaneState)
  const [, setdisplayedView] = useRecoilState(displayedViewState)
  const [title, setTitle] = useRecoilState(titleState)

  const onSelect = (e: React.MouseEvent) => {
    setSelectedType(e.currentTarget.id)
  }

  const onTitleChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onSubmit = () => {
    const newPlane = {
      id: 3,
      title,
      last_opened: true,
      plane_type: selectedType
    }

    // TODO: impl database create

    setLoadedPlanes((l) => [...l, newPlane])

    setdisplayedView(View.Plane)
    setdisplayedPlane(newPlane)
  }

  return (
    <div className="w-10/12 flex justify-center items-center text-sm text-neutral-400">
      <div className="flex flex-col items-center justify-center py-24 w-1/4 space-y-2">
        <input
          type="text"
          placeholder="Title"
          className="py-2 w-full px-4 rounded-md bg-neutral-900"
          onKeyUp={onTitleChange}
        ></input>
        <div className="flex space-x-2 py-4 w-full">
          <button
            className={twMerge(
              'py-6 flex rounded-md items-center justify-center flex-col border border-neutral-900 hover:bg-neutral-800 w-1/2',
              selectedType === 'linear' && 'bg-neutral-900'
            )}
            id="linear"
            onClick={onSelect}
          >
            <MdBlurLinear className="mb-4" /> Linear
          </button>
          <button
            className={twMerge(
              'py-6 flex rounded-md items-center justify-center flex-col border border-neutral-900 hover:bg-neutral-800 w-1/2 ',
              selectedType === 'freeflow' && 'bg-neutral-900'
            )}
            id="freeflow"
            onClick={onSelect}
          >
            <GiBlackHoleBolas className="mb-4" /> FreeFlow
          </button>
        </div>
        <button
          className="py-2 w-1/2 px-4 rounded-md bg-neutral-900"
          onClick={onSubmit}
        >
          Create
        </button>
      </div>
    </div>
  )
}
