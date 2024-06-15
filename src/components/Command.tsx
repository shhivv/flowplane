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
import { GiBlackHoleBolas } from 'react-icons/gi';

// a lot of the code is as is from sidebar.
export function CommandMenu() {
  const planes = useLoadedPlanesStore((l) => l.planes).sort(
    (a, b) => a.created_at! - b.created_at!
  );

  const changePlane = useMainDisplayedPlane((c) => c.setPlaneId);

  const changeToPlaneView = useViewStore((v) => v.setPlane);
  const changeToCreateView = useViewStore((v) => v.setCreate);
  const changeToSettingsView = useViewStore((v) => v.setSettings);
  const [open, setOpen] = useState(false);

  const newPlane = () => {
    changeToCreateView();
    setOpen(false);
  };

  const settings = () => {
    changeToSettingsView();
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
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((opened) => !opened);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for planes or action" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Planes">
          {planes.map((plane) => (
            <CommandItem
              key={plane.id}
              value={plane.title + String(plane.id)}
              onSelect={() => changePlaneOnClick(plane)}
            >
              {plane.plane_type === 'linear' ? (
                <MdBlurLinear className="mr-2 h-4 w-4" />
              ) : plane.plane_type === 'slate' ? (
                <GiBlackHoleBolas className="mr-2 h-4 w-4" />
              ) : (
                <MdOutlineDraw className="mr-2 h-4 w-4" />
              )}
              <span>{plane.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={newPlane}>New Plane</CommandItem>
          <CommandItem onSelect={settings}>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
