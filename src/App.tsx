import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';
import NewPlane from './components/NewPlane';
import Linear from './components/planes/Linear';
import Sidebar from './components/Sidebar';

import { listen } from '@tauri-apps/api/event';
import ClosePortalAlert from './components/ClosePortal';
import Introduction from './components/Intro';
import Slate from './components/planes/Slate';
import Settings from './Settings';
import { useLoadedPlanesStore, useMainDisplayedPlane } from './state/plane';
import { useViewStore, View } from './state/view';

import { appWindow } from '@tauri-apps/api/window';
import Whiteboard from './components/planes/Whiteboard';
import { CommandMenu } from './components/Command';
import Clipboard from './components/Clipboard';
import Chat from './components/Chat';

// custom titlebar action handlers
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

  const displayedView = useViewStore((v) => v.view);
  const changeToPlaneView = useViewStore((v) => v.setPlane);

  const [portalOpen, setPortalOpen] = useState(
    Boolean(localStorage.getItem('portalOpen')) || false
  );
  const { planeId, setPlaneId } = useMainDisplayedPlane();

  useEffect(() => {
    (async () => {
      const fetched = await fetchPlanes();
      if (fetched.planes.length > 0) {
        changeToPlaneView();
        const lastPlane = fetched.lastAccessed!.id!;
        await invoke('set_last_accessed', { planeId: lastPlane });
        setPlaneId(lastPlane);
      }
    })();
  }, [fetchPlanes, changeToPlaneView, setPlaneId]);

  useEffect(() => {
    const listener = listen<string>('portalSwitch', () => {
      setPortalOpen(!portalOpen);
      // localstorage takes booleans as string literals
      localStorage.setItem('portalOpen', !portalOpen ? 'true' : '');
    });
    return () => {
      listener.then((f) => f());
    };
  }, [portalOpen]);

  const getDisplayComponent = (dislayPlaneId: number, view: View) => {
    const plane = planes.find((i) => i.id === dislayPlaneId);
    let comp;
    if (view === View.Plane && plane) {
      let planeComp;
      switch (plane.plane_type) {
        case 'linear':
          planeComp = <Linear key={plane.id} plane={plane} floating={false} />;
          break;
        case 'slate':
          planeComp = <Slate key={plane.id} plane={plane} floating={false} />;
          break;
        case 'whiteboard':
          planeComp = (
            <Whiteboard key={plane.id} plane={plane} floating={false} />
          );
          break;
        default:
          planeComp = <Linear key={plane.id} plane={plane} floating={false} />;
      }

      comp = <div className="w-5/6">{planeComp}</div>;
    } else if (view === View.Create) {
      comp = <NewPlane />;
    } else if (view === View.Settings) {
      comp = <Settings />;
    } else if (view === View.Clipboard) {
      comp = <Clipboard />;
    } else if (view === View.Chat) {
      comp = <Chat />;
    } else {
      comp = <Introduction />;
    }

    return comp;
  };

  return (
    <div className="flex h-screen w-screen bg-background">
      <Sidebar />
      {portalOpen ? (
        <ClosePortalAlert />
      ) : (
        getDisplayComponent(planeId, displayedView!)
      )}
      <CommandMenu />
    </div>
  );
}

export default App;
