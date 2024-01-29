import { MdBlurLinear } from 'react-icons/md';
import { GiBlackHoleBolas } from 'react-icons/gi';
import { twMerge } from 'tailwind-merge';

import React, { FormEvent, useState } from 'react';

import {
  useLoadedPlanesStore,
  convertEnum,
  useMainDisplayedPlane,
} from '../state/plane';
import { useViewStore } from '../state/view';

export default function NewPlane() {
  const [selectedType, setSelectedType] = useState('linear');
  const addLoadedPlane = useLoadedPlanesStore((lp) => lp.add);
  const changeToPlaneView = useViewStore((v) => v.setPlane);
  const changePlane = useMainDisplayedPlane((c) => c.setPlaneId);
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
      title: title || 'Untitled',
      plane_type: convertEnum(selectedType),
    };

    const addedPlane = await addLoadedPlane(newPlane);
    changeToPlaneView();
    changePlane(addedPlane.id!);
  };

  return (
    <div className="grid-design flex w-10/12 items-center justify-center bg-bgshade text-sm text-muted-foreground">
      <div className=" flex h-1/2 w-2/5 flex-col  items-center justify-center rounded-lg bg-gradient-to-b from-primary/40 to-primary/0 drop-shadow-xl">
        <div className="flex w-3/4 py-3">
          <h1 className="font-heading text-foreground">Create new Plane</h1>
        </div>
        <form
          className="flex w-3/4 flex-col items-center justify-center space-y-2"
          onSubmit={onSubmit}
        >
          <input
            type="text"
            placeholder="Title"
            className="w-full rounded-md border border-border bg-bgshade py-3 px-4 outline-none focus:border-primary/50"
            onKeyUp={onTitleChange}
            autoFocus
          ></input>
          <div className="flex w-full space-x-2 py-4">
            <button
              className={twMerge(
                'flex w-1/2 flex-col items-center justify-center rounded-md border border-border bg-bgshade py-6 hover:bg-muted',
                selectedType === 'linear' && 'border-primary/50 bg-transparent'
              )}
              id="linear"
              onClick={onSelect}
              type="button"
            >
              <MdBlurLinear className="mb-4" /> Linear
            </button>
            <button
              className={twMerge(
                'flex w-1/2 flex-col items-center justify-center rounded-md border border-border bg-bgshade py-6 hover:bg-muted',
                selectedType === 'slate' && 'border-primary/50 bg-transparent'
              )}
              id="slate"
              onClick={onSelect}
              type="button"
            >
              <GiBlackHoleBolas className="mb-4" /> Slate
            </button>
          </div>
          <button
            type="submit"
            className="w-1/2 rounded-md border border-primary/80 bg-primary/70 py-2 px-4 text-foreground shadow-xl transition duration-300 ease-in-out hover:scale-105 hover:bg-primary/80"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
