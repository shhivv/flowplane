import { FiPlus } from 'react-icons/fi';
import { FaDiscord, FaRegClipboard, FaMarkdown } from 'react-icons/fa';
import { CiSettings } from 'react-icons/ci';
import { MdBlurLinear, MdOutlineDraw } from 'react-icons/md';
import { IoChatbox } from 'react-icons/io5';

import {
  useLoadedPlanesStore,
  IPlane,
  useMainDisplayedPlane,
} from '../state/plane';
import { useViewStore } from '../state/view';
import { invoke } from '@tauri-apps/api';
import { Button } from '@/components/ui/button';
import { CreateFromWebpage } from './CreateFromWebpage';

export default function SideBar() {
  const planes = useLoadedPlanesStore((l) => l.planes).sort(
    (a, b) => a.created_at! - b.created_at!
  );

  const changePlane = useMainDisplayedPlane((c) => c.setPlaneId);

  const changeToPlaneView = useViewStore((v) => v.setPlane);
  const changeToCreateView = useViewStore((v) => v.setCreate);
  const changeToSettingsView = useViewStore((v) => v.setSettings);
  const changeToClipboardView = useViewStore((v) => v.setClipboard);
  const changeToChatView = useViewStore((v) => v.setChat);

  const newPlane = () => {
    changeToCreateView();
  };

  const settings = () => {
    changeToSettingsView();
  };

  const clipboard = () => {
    changeToClipboardView();
  };

  const chat = () => {
    changeToChatView();
  };

  const changePlaneOnClick = async (plane: IPlane) => {
    changeToPlaneView();
    await invoke('set_last_accessed', { planeId: plane.id });
    changePlane(plane.id!);
  };

  return (
    <div className="flex h-screen w-1/6 min-w-min flex-col border-r border-r-muted text-sm">
      <div className="flex flex-col space-y-4 px-5 py-6 font-heading text-lg font-bold text-foreground">
        <div className="flex items-center justify-between">
          <div>Flowplane</div>
          <div className="flex items-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={clipboard}
              className="text-base text-muted-foreground/80 shadow-none"
            >
              <FaRegClipboard />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={settings}
              className="text-xl text-muted-foreground shadow-none"
            >
              <CiSettings />
            </Button>
          </div>
        </div>
        <hr className="w-1/5 border-muted-foreground/30"></hr>
      </div>
      <div className="h-full w-64 overflow-y-auto px-3 text-muted-foreground">
        {planes.map((plane) => (
          <button
            className="flex w-full items-center space-x-3 rounded-md px-2 py-2 hover:bg-accent"
            key={plane.id}
            onClick={() => {
              changePlaneOnClick(plane);
            }}
          >
            {plane.plane_type === 'linear' ? (
              <MdBlurLinear />
            ) : plane.plane_type === 'slate' ? (
              <FaMarkdown />
            ) : (
              <MdOutlineDraw />
            )}{' '}
            <span className="flex w-4/5">
              <h1 className="overflow-hidden  overflow-ellipsis whitespace-nowrap">
                {plane.title}
              </h1>
            </span>
          </button>
        ))}
      </div>
      <CreateFromWebpage />
      <div className="flex w-full flex-col justify-center space-y-2 p-3">
        <div className="hidden w-full space-y-2 rounded-md border border-dashed border-primary/60 p-4 text-sm tracking-wide text-muted-foreground xl:block">
          <div>
            Flowplane is currently in beta. If you have any feedback or wish to
            report a bug, please join our Discord community.
          </div>

          <Button variant="secondary" size="sm" className="space-x-2" asChild>
            <a
              href="https://discord.gg/sZEaH6gB2Q"
              target="_blank"
              rel="noreferrer"
            >
              <FaDiscord />
              <span>Join our Discord</span>
            </a>
          </Button>
        </div>
        <Button
          className="w-full space-x-2 "
          onClick={chat}
          variant="secondary"
        >
          <span className="rounded bg-primary/30 px-2">AI</span>
          <IoChatbox />
          <span className="lg:inline">Chat</span>
        </Button>
        <Button
          className="w-full space-x-2 "
          onClick={newPlane}
          variant="secondary"
        >
          <FiPlus />
          <span className="lg:inline">New Plane</span>
        </Button>
      </div>
    </div>
  );
}
