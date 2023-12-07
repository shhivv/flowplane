import React, { useEffect } from 'react';
import NewPlane from './components/NewPlane';
import Linear from './components/planes/Linear';
import Sidebar from './components/Sidebar';
import { invoke } from '@tauri-apps/api';


import { useViewStore, View } from './state/view';
import {
  useLoadedPlanesStore,
  useDisplayedPlaneStore,
  IPlane,
} from './state/plane';
import ScratchPad from './components/planes/ScratchPad';
import Introduction from './components/Intro';

function App() {
  const displayedPlane = useDisplayedPlaneStore((dp) => dp.plane);
  const changePlane = useDisplayedPlaneStore((dp) => dp.changePlane);

  const fetchPlanes = useLoadedPlanesStore((lp) => lp.fetch);

  const displayedView = useViewStore((v) => v.view);
  const changeToPlaneView = useViewStore((v) => v.setPlane);

  useEffect(() => {
    const asyncChange = async () => {
      const fetched = await fetchPlanes();

      if (fetched.planes.length !== 0) {
        changeToPlaneView();
        await changePlane(fetched.lastAccessed!);
      }
      await invoke('jsdebug', {
        msg: "start rendering app",
      });
    };
    asyncChange();
  }, [fetchPlanes, changeToPlaneView, changePlane]);

  const getDisplayComponent = (plane: IPlane, view: View) => {
    if (view === View.Plane && plane) {
      if (plane.plane_type === 'linear') {
        return (<div className="w-4/5">
           <Linear key={plane.id} plane={plane} floating={false} />;
        </div>);
      } else {
        return <ScratchPad key={plane.id} plane={plane} />;
      }
    } else if (view === View.Create) {
      return <NewPlane />;
    } else {
      return <Introduction />;
    }
  };

  return (
    <div className="w-screen h-screen bg-background flex">
      <Sidebar />
      {getDisplayComponent(displayedPlane!, displayedView!)}
    </div>
  );
}

export default App;
