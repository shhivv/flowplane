import { useEffect, useState } from 'react';
import PortalInfo from './components/PortalInfo';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IPlane, useLoadedPlanesStore } from './state/plane';
import Linear from './components/planes/Linear';
import Slate from './components/planes/Slate';
import Introduction from './components/Intro';
import { listen } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';

export default function Portal() {
  const fetchPlanes = useLoadedPlanesStore((lp) => lp.fetch);
  const [planeId, setPlaneId] = useState(
    Number(localStorage.getItem('portalPlane')) || 0
  );
  const planes = useLoadedPlanesStore((lp) => lp.planes);
  const [portalOpen, setPortalOpen] = useState(
    localStorage.getItem('portalOpen') || false
  );
  useEffect(() => {
    const listener = listen<string>('portalSwitch', () => {
      setPortalOpen(!portalOpen);
    });
    return () => {
      listener.then((f) => f());
    };
  }, [portalOpen]);

  useEffect(() => {
    async function cback() {
      await fetchPlanes();
    }

    cback();
  }, [fetchPlanes]);

  const getDisplayComponent = (_planeId: number) => {
    const plane = planes.find((obj) => obj.id === _planeId);

    if (plane && portalOpen) {
      if (plane.plane_type === 'linear') {
        return <Linear key={plane.id} plane={plane} floating />;
      } else if (plane.plane_type === 'slate') {
        return <Slate key={plane.id} plane={plane} floating />;
      }
    } else {
      return (
        <div className="flex h-full w-full justify-center">
          <Introduction />
        </div>
      );
    }
  };

  const onChange = (id: string) => {
    setPlaneId(Number(id));
    localStorage.setItem('portalPlane', id);
  };

  return (
    <div className="card dark relative flex h-screen w-screen items-center justify-center overflow-hidden rounded-lg p-[2px] font-sans">
      <div className="fancy" />
      <div className="relative flex h-full w-full flex-col rounded-lg bg-background">
        <div className="flex-1 overflow-y-hidden">
          {getDisplayComponent(planeId)}
        </div>
        <div className="flex h-14 items-center justify-between rounded-b-lg border-t border-dashed border-border bg-primary/10">
          <Select onValueChange={onChange} defaultValue={String(planeId)}>
            <SelectTrigger className="mx-12 h-8 w-40 border-primary/40 bg-primary/20 text-primary-foreground ">
              <SelectValue placeholder="Plane" />
            </SelectTrigger>
            <SelectContent className="dark border-border font-sans">
              {planes.map((i) => (
                <SelectItem value={String(i.id)} key={i.id}>
                  {i.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <PortalInfo />
        </div>
      </div>
    </div>
  );
}
