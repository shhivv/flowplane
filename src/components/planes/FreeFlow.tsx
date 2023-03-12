import { type IPlane } from '../../state/plane';
import { GiBlackHoleBolas } from 'react-icons/gi';
import React from 'react';
import DeletePlane from '../DeletePlane';
import Draggable from 'react-draggable';
import InfiniteViewer from 'react-infinite-viewer';

interface IFreeFlow {
  plane: IPlane;
}

export default function FreeFlow({ plane }: IFreeFlow) {
  return (
    <div className="w-5/6 py-8 px-16 text-neutral-400 font-heading overflow-y-auto">
    <div className="flex text-neutral-500 justify-between">
        <div className="flex items-center space-x-3 w-full">
          <GiBlackHoleBolas />
          <h3 className="w-4/5 overflow-ellipsis whitespace-nowrap overflow-hidden">{plane?.title}</h3>
        </div>
        <DeletePlane plane={plane} />
      </div>
      <div>
        <InfiniteViewer
          className="viewer"
          margin={0}
          threshold={0}
          rangeX={[0, 0]}
          rangeY={[0, 0]}
          onScroll={(e) => {
            console.log(e);
          }}
        >
          <div className="viewport">
            <Draggable>
              <div>a</div>
            </Draggable>
          </div>
        </InfiniteViewer>
      </div>
    </div>
  );
}
