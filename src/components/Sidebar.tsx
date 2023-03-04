import { BsPlusLg } from 'react-icons/bs';
import { MdBlurLinear } from 'react-icons/md';
import { GiBlackHoleBolas } from 'react-icons/gi';
import React from 'react';

import {
  useLoadedPlanesStore,
  useDisplayedPlaneStore,
  IPlane,
} from '../state/plane';
import { useViewStore } from '../state/view';

export default function SideBar() {
  const planes = useLoadedPlanesStore((l) => l.planes);

  const changeToPlaneView = useViewStore((v) => v.setPlane);
  const changeToCreateView = useViewStore((v) => v.setCreate);

  const changePlane = useDisplayedPlaneStore((dp) => dp.changePlane);

  const newPlane = () => {
    changeToCreateView();
  };

  const changePlaneOnClick = (plane: IPlane) => {
    changeToPlaneView();
    changePlane(plane);
  };

  return (
    <div className="h-screen w-1/6 bg-[#111] border-r border-r-neutral-800 p-4 text-sm">
      <div className="py-2">
        <div className="font-heading mb-8 text-lg px-1 text-neutral-300">
          Flowplane
        </div>
        <div className="text-neutral-400">
          {planes.map((plane) => (
            <button
              className="flex items-center space-x-3  hover:bg-neutral-900 p-1 w-full  rounded-md"
              key={plane.id}
              onClick={(_) => {
                changePlaneOnClick(plane);
              }}
            >
              {plane.plane_type === 'linear' ? (
                <MdBlurLinear />
              ) : (
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
  );
}
