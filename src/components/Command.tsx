import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useEffect, useState } from 'react';

import {
  useLoadedPlanesStore,
  IPlane,
  useMainDisplayedPlane,
} from '../state/plane';
import { useViewStore } from '../state/view';
import { invoke } from '@tauri-apps/api';
import { CommandSeparator } from 'cmdk';
import { MdBlurLinear, MdOutlineDraw } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';
import { FaRegClipboard, FaMarkdown } from 'react-icons/fa';
import { CiSettings } from 'react-icons/ci';
import { IoChatbox } from 'react-icons/io5';

// a lot of the code is as is from sidebar.
export function CommandMenu() {
  const planes = useLoadedPlanesStore((l) => l.planes).sort(
    (a, b) => a.created_at! - b.created_at!
  );

  const changePlane = useMainDisplayedPlane((c) => c.setPlaneId);

  const changeToPlaneView = useViewStore((v) => v.setPlane);
  const changeToCreateView = useViewStore((v) => v.setCreate);
  const changeToSettingsView = useViewStore((v) => v.setSettings);
  const changeToClipboardView = useViewStore((v) => v.setClipboard);
  const changeToChatView = useViewStore((v) => v.setChat);
  const [open, setOpen] = useState(false);

  const newPlane = () => {
    changeToCreateView();
    setOpen(false);
  };

  const settings = () => {
    changeToSettingsView();
    setOpen(false);
  };

  const clipboard = () => {
    changeToClipboardView();
    setOpen(false);
  };

  const chat = () => {
    changeToChatView();
    setOpen(false);
  };

  const changePlaneOnClick = async (plane: IPlane) => {
    changeToPlaneView();
    await invoke('set_last_accessed', { planeId: plane.id });
    changePlane(plane.id!);
    setOpen(false);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((opened) => !opened);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Where would you like to go?" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Planes">
          {planes.map((plane) => (
            <CommandItem
              className="text-muted-foreground"
              key={plane.id}
              value={plane.title + String(plane.id)}
              onSelect={() => changePlaneOnClick(plane)}
            >
              {plane.plane_type === 'linear' ? (
                <MdBlurLinear className="mr-2" />
              ) : plane.plane_type === 'slate' ? (
                <FaMarkdown className="mr-2" />
              ) : (
                <MdOutlineDraw className="mr-2" />
              )}
              <span>{plane.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions" className="text-muted-foreground">
          <CommandItem onSelect={newPlane}>
            <FiPlus className="mr-2" />
            New Plane
          </CommandItem>
          <CommandItem onSelect={settings}>
            <CiSettings className="mr-2" />
            Settings
          </CommandItem>
          <CommandItem
            onSelect={clipboard}
            className="text-muted-foreground/80"
          >
            <FaRegClipboard className="mr-2" />
            Clipboard
          </CommandItem>
          <CommandItem onSelect={chat} className="text-muted-foreground/80">
            <IoChatbox className="mr-2" />
            AI Chat
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
