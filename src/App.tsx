import React, { useEffect, useState } from 'react';
import NewPlane from './components/NewPlane';
import Linear from './components/planes/Linear';
import Sidebar from './components/Sidebar';
import { invoke } from '@tauri-apps/api';

import { useViewStore, View } from './state/view';
import { useLoadedPlanesStore, useMainDisplayedPlane } from './state/plane';
import Slate from './components/planes/Slate';
import Introduction from './components/Intro';
import { listen } from '@tauri-apps/api/event';
import ClosePortalAlert from './components/ClosePortal';
import Settings from './Settings';

import { appWindow } from '@tauri-apps/api/window';

document!
  .getElementById('titlebar-minimize')!
  .addEventListener('click', () => appWindow.minimize());
document!
  .getElementById('titlebar-maximize')!
  .addEventListener('click', () => appWindow.toggleMaximize());
document!
  .getElementById('titlebar-close')!
  .addEventListener('click', () => appWindow.close());

function App() {
  const fetchPlanes = useLoadedPlanesStore((lp) => lp.fetch);
  const planes = useLoadedPlanesStore((lp) => lp.planes);
  const [portalOpen, setPortalOpen] = useState(
    Boolean(localStorage.getItem('portalOpen')) || false
  );

  const displayedView = useViewStore((v) => v.view);
  const changeToPlaneView = useViewStore((v) => v.setPlane);

  const { planeId, setPlaneId } = useMainDisplayedPlane();

  useEffect(() => {
    const asyncChange = async () => {
      const fetched = await fetchPlanes();

      if (fetched.planes.length !== 0) {
        changeToPlaneView();
        const last = fetched.lastAccessed!.id!;
        await invoke('set_last_accessed', { planeId: last });
        setPlaneId(last);
      }
    };
    asyncChange();
  }, [fetchPlanes, changeToPlaneView, setPlaneId]);

  useEffect(() => {
    const listener = listen<string>('portalSwitch', () => {
      console.log(!portalOpen);
      setPortalOpen(!portalOpen);
      localStorage.setItem('portalOpen', !portalOpen ? 'true' : '');
    });
    return () => {
      listener.then((f) => f());
    };
  }, [portalOpen]);

  const getDisplayComponent = (_planeId: number, view: View) => {
    const plane = planes.find((obj) => obj.id === _planeId);

    if (view === View.Plane && plane) {
      if (plane.plane_type === 'linear') {
        return (
          <div className="w-5/6">
            <Linear key={plane.id} plane={plane} floating={false} />;
          </div>
        );
      } else if (plane.plane_type === 'slate') {
        return (
          <div className="w-5/6">
            <Slate key={plane.id} plane={plane} floating={false} />;
          </div>
        );
      }
    } else if (view === View.Create) {
      return <NewPlane />;
    } else if (view === View.Settings) {
      return <Settings />;
    } else {
      return <Introduction />;
    }
  };

  return (
    <div className="flex h-screen  w-screen bg-background">
      <Sidebar />
      {portalOpen ? (
        <ClosePortalAlert />
      ) : (
        getDisplayComponent(planeId, displayedView!)
      )}
    </div>
  );
}

export default App;
