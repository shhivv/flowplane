import { type IPlane } from '../../state/plane';
import { GiBlackHoleBolas } from 'react-icons/gi';
import React, { useRef } from 'react';
import Movable from 'react-moveable';
import DeletePlane from '../DeletePlane';
import InfiniteViewer from 'react-infinite-viewer';
import ScratchPadItem from '../ScratchPadItem';

interface IScratchPad {
  plane: IPlane;
}

export default function ScratchPad({ plane }: IScratchPad) {
  const target = useRef(null);

  return (
    <div className="w-5/6 py-8 text-neutral-400 font-heading overflow-y-hidden overflow-x-auto h-screen">
      <div className="flex text-neutral-500 justify-between px-16">
        <div className="flex items-center space-x-3 w-full">
          <GiBlackHoleBolas />
          <h3 className="w-4/5 overflow-ellipsis whitespace-nowrap overflow-hidden">
            {plane?.title}
          </h3>
        </div>
        <DeletePlane plane={plane} />
      </div>
      <div className="h-full">
        <InfiniteViewer
          useMouseDrag
          useWheelScroll
          useAutoZoom
          zoomRange={[0.1, 10]}
          maxPinchWheel={10}
          displayVerticalScroll={false}
          displayHorizontalScroll={false}
          className="viewer h-full w-full"
        >
          <div className="viewport">
            <ScratchPadItem>
              <div className="bg-red-500 w-12 h-12"></div>
            </ScratchPadItem>
          </div>
        </InfiniteViewer>
      </div>
    </div>
  );
}
