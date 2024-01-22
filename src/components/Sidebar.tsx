import { BsPlusLg } from 'react-icons/bs';
import { MdBlurLinear } from 'react-icons/md';
import { GiBlackHoleBolas } from 'react-icons/gi';

import {
  useLoadedPlanesStore,
  IPlane,
  useMainDisplayedPlane,
} from '../state/plane';
import { useViewStore } from '../state/view';
import { invoke } from '@tauri-apps/api';

export default function SideBar() {
  const planes = useLoadedPlanesStore((l) => l.planes).sort(
    (a, b) => a.created_at! - b.created_at!
  );

  const changePlane = useMainDisplayedPlane((c) => c.setPlaneId);

  const changeToPlaneView = useViewStore((v) => v.setPlane);
  const changeToCreateView = useViewStore((v) => v.setCreate);

  const newPlane = () => {
    changeToCreateView();
  };

  const changePlaneOnClick = async (plane: IPlane) => {
    changeToPlaneView();
    await invoke('set_last_accessed', { planeId: plane.id });
    changePlane(plane.id!);
  };

  return (
    <div className="flex h-screen w-1/6 flex-col border-r border-r-border bg-background text-sm">
      <div className="flex flex-col space-y-4 py-6 px-5 font-heading text-lg font-bold text-foreground">
        <div className="hidden lg:flex">Flowplane</div>
        <hr className="w-1/5 border-muted-foreground/30"></hr>
      </div>
      <div className="h-full overflow-y-auto px-3 text-muted-foreground">
        {planes.map((plane) => (
          <button
            className="flex w-full items-center  space-x-3 rounded-md px-2 py-2 hover:bg-accent"
            key={plane.id}
            onClick={() => {
              changePlaneOnClick(plane);
            }}
          >
            {plane.plane_type === 'linear' ? (
              <MdBlurLinear />
            ) : (
              <GiBlackHoleBolas />
            )}{' '}
            <span className="flex w-4/5">
              <h1 className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                {plane.title}
              </h1>
            </span>
          </button>
        ))}
      </div>

      <button
        className="left-0 mt-auto flex w-full items-center space-x-4 bg-inherit py-4 px-4 text-muted-foreground hover:bg-accent"
        onClick={newPlane}
      >
        <BsPlusLg /> <span>New plane</span>
      </button>
    </div>
  );
}
