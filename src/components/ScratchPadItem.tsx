import { useRef } from 'react';
import Moveable from 'react-moveable';

export default function ScratchPadItem({
  children,
}: {
  children: React.ReactNode;
}) {
  const target = useRef(null);

  return (
    <>
      <Moveable
        target={target}
        resizable
        keepRatio
        onResize={(e) => {
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.transform = e.drag.transform;
        }}
      />
      <div ref={target} className="target w-min h-min">
        {children}
      </div>
    </>
  );
}
