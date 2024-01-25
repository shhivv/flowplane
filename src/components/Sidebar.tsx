import { BsPlusLg } from 'react-icons/bs';
import { FaDiscord } from 'react-icons/fa';
import { CiSettings } from 'react-icons/ci';
import { MdBlurLinear } from 'react-icons/md';
import { GiBlackHoleBolas } from 'react-icons/gi';

import {
  useLoadedPlanesStore,
  IPlane,
  useMainDisplayedPlane,
} from '../state/plane';
import { useViewStore } from '../state/view';
import { invoke } from '@tauri-apps/api';
import { Button } from '@/components/ui/button';

export default function SideBar() {
  const planes = useLoadedPlanesStore((l) => l.planes).sort(
    (a, b) => a.created_at! - b.created_at!
  );

  const changePlane = useMainDisplayedPlane((c) => c.setPlaneId);

  const changeToPlaneView = useViewStore((v) => v.setPlane);
  const changeToCreateView = useViewStore((v) => v.setCreate);
  const changeToSettingsView = useViewStore((v) => v.setSettings);

  const newPlane = () => {
    changeToCreateView();
  };

  const settings = () => {
    changeToSettingsView();
  };

  const changePlaneOnClick = async (plane: IPlane) => {
    changeToPlaneView();
    await invoke('set_last_accessed', { planeId: plane.id });
    changePlane(plane.id!);
  };

  return (
    <div className="flex h-screen w-1/6 flex-col border-r border-r-border bg-[#111] text-sm">
      <div className="flex flex-col space-y-4 py-6 px-5 font-heading text-lg font-bold text-foreground">
        <div className="flex items-center justify-between">
        <div className="hidden lg:flex">Flowplane</div>
        <Button variant="ghost" onClick={settings} className="text-muted-foreground text-xl">
          <CiSettings />
        </Button>
        </div>
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
      <div className="w-full flex flex-col justify-center p-3 space-y-2">
        <div className="w-full border-dashed border-primary/60 border rounded-md text-sm text-muted-foreground p-4 space-y-2 tracking-wide">
          <div>
          Flowplane is currently in beta. If you have any feedback or wish to report a bug, please join our Discord community.
          </div>

              <Button variant="secondary" size="sm" className="space-x-2" asChild>
              <a
        href="https://discord.gg/sZEaH6gB2Q"
        target="_blank"
        rel="noreferrer"
      >
           <FaDiscord/>
                <span>Join our Discord</span>
      </a>
      </Button>
        </div>
      <Button className="w-full space-x-2" onClick={newPlane} size="lg" variant="secondary">
      <BsPlusLg/>
        <span>New Plane</span></Button>

      </div>
    </div>
  );
}
