import { MdBlurLinear } from 'react-icons/md';
import { GiBlackHoleBolas } from 'react-icons/gi';
import { twMerge } from 'tailwind-merge';

import React, { FormEvent, useState } from 'react';

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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newPlane = {
      title: title || "Untitled",
      plane_type: selectedType,
    };

    const addedPlane = await addLoadedPlane(newPlane);
    changeToPlaneView();
    setDisplayedPlane(addedPlane);
  };

  return (
    <div className="w-10/12 flex justify-center items-center text-sm text-neutral-400">
      <form
        className="flex flex-col items-center justify-center py-24 w-1/4 space-y-2"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          placeholder="Title"
          className="py-2 w-full px-4 rounded-md bg-neutral-900"
          onKeyUp={onTitleChange}
          autoFocus
        ></input>
        <div className="flex space-x-2 py-4 w-full">
          <button
            className={twMerge(
              'py-6 flex rounded-md items-center justify-center flex-col border border-neutral-900 hover:bg-neutral-800 w-1/2',
              selectedType === 'linear' && 'bg-neutral-900'
            )}
            id="linear"
            onClick={onSelect}
            type="button"
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
            type="button"
          >
            <GiBlackHoleBolas className="mb-4" /> FreeFlow
          </button>
        </div>
        <button
          type="submit"
          className="py-2 w-1/2 px-4 rounded-md bg-neutral-900"
        >
          Create
        </button>
      </form>
    </div>
  );
}
