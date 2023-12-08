import { BsPlusLg } from 'react-icons/bs';
import { MdBlurLinear } from 'react-icons/md';
import { GiBlackHoleBolas } from 'react-icons/gi';

import {
  useLoadedPlanesStore,
  useDisplayedPlaneStore,
  IPlane,
} from '../state/plane';
import { useViewStore } from '../state/view';

export default function SideBar() {
  const planes = useLoadedPlanesStore((l) => l.planes).sort(
    (a, b) => a.created_at! - b.created_at!
  );

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
    <div className="h-screen w-1/6 bg-background border-r border-r-neutral-800 text-sm flex flex-col">
      <div className="font-heading py-4 font-bold text-lg px-4 flex items-center gap-2 text-neutral-300">
        <img src="logo.svg"/>
        <div className="hidden lg:flex">Flowplane</div>
      </div>
      <div className="text-neutral-400 h-full overflow-y-auto px-4">
        {planes.map((plane) => (
          <button
            className="flex items-center space-x-3  hover:bg-neutral-900 p-1 w-full rounded-md"
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
            <span className="w-4/5 flex">
              <h1 className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                {plane.title}
              </h1>
            </span>
          </button>
        ))}
      </div>

      <button
        className="left-0 text-neutral-400 py-4 mt-auto flex items-center space-x-4 bg-inherit hover:bg-neutral-900 w-full px-4"
        onClick={newPlane}
      >
        <BsPlusLg /> <span>New plane</span>
      </button>
    </div>
  );
}
