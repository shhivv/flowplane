import { MdBlurLinear } from 'react-icons/md';
import { GiBlackHoleBolas } from 'react-icons/gi';
import { twMerge } from 'tailwind-merge';

import React, { useState } from 'react';

import { useLoadedPlanesStore, useDisplayedPlaneStore } from '../state/plane';
import { useViewStore } from '../state/view';

export default function NewPlane() {
  const [selectedType, setSelectedType] = useState('linear');
  const addLoadedPlane = useLoadedPlanesStore((lp) => lp.add);
  const setDisplayedPlane = useDisplayedPlaneStore((dp) => dp.changePlane);
  const changeToPlaneView = useViewStore((v) => v.setPlane);
  const [title, setTitle] = useState('');

  const onSelect = (e: React.MouseEvent) => {
    setSelectedType(e.currentTarget.id);
  };

  const onTitleChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const onSubmit = async () => {
    const newPlane = {
      title,
      plane_type: selectedType,
    };

    const addedPlane = await addLoadedPlane(newPlane);
    console.log(addedPlane);
    changeToPlaneView();
    setDisplayedPlane(addedPlane);
  };

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
  );
}
