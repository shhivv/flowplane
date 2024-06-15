import { useEffect, useState } from 'react';
import PortalInfo from './components/PortalInfo';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { listen } from '@tauri-apps/api/event';
import Introduction from './components/Intro';
import Linear from './components/planes/Linear';
import Slate from './components/planes/Slate';
import Whiteboard from './components/planes/Whiteboard';
import { useLoadedPlanesStore } from './state/plane';
import { ThemeProvider } from './components/theme-provider';

export default function Portal() {
  const { fetch: fetchPlanes, planes } = useLoadedPlanesStore();

  const [planeId, setPlaneId] = useState(
    Number(localStorage.getItem('portalPlane')) || 0
  );
  const [loaded, setLoaded] = useState(false);
  // TODO::change to sync external store
  const [portalOpen, setPortalOpen] = useState(
    localStorage.getItem('portalOpen') || false
  );

  useEffect(() => {
    const listener = listen<string>('portalSwitch', () => {
      // to ensure that component doesn't load because if it does, a db call is triggered which causes a panic
      setLoaded(false);
      setPortalOpen(!portalOpen);
    });
    return () => {
      listener.then((f) => f());
    };
  }, [portalOpen]);

  useEffect(() => {
    (async () => {
      await fetchPlanes();
      setLoaded(true);
    })();
  }, [fetchPlanes, portalOpen]);

  const getDisplayComponent = (displayPlaneId: number) => {
    const plane = planes.find((i) => i.id === displayPlaneId);

    if (plane && portalOpen) {
      if (plane.plane_type === 'linear') {
        return <Linear key={plane.id} plane={plane} floating />;
      } else if (plane.plane_type === 'slate') {
        return <Slate key={plane.id} plane={plane} floating />;
      } else if (plane.plane_type === 'whiteboard') {
        return <Whiteboard key={plane.id} plane={plane} floating />;
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="card relative flex h-screen w-screen items-center justify-center overflow-hidden rounded-lg font-sans">
        <div className="relative flex h-full w-full flex-col rounded-lg bg-background">
          <div className="flex-1 overflow-y-hidden rounded-lg">
            {loaded && getDisplayComponent(planeId)}
          </div>
          <div className="flex h-14 items-center justify-between rounded-b-lg border-t border-dashed border-border bg-primary/10">
            <Select onValueChange={onChange} defaultValue={String(planeId)}>
              <SelectTrigger className="mx-12 h-8 w-40 overflow-hidden  overflow-ellipsis whitespace-nowrap border-primary/40 bg-primary/20 text-primary-foreground ">
                <SelectValue placeholder="Plane" />
              </SelectTrigger>
              <SelectContent>
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
    </ThemeProvider>
  );
}
