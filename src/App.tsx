import React, { useEffect } from 'react';
import NewPlane from './components/NewPlane';
import Linear from './components/planes/Linear';
import Sidebar from './components/Sidebar';

import { useViewStore, View } from './state/view';
import {
  useLoadedPlanesStore,
  useDisplayedPlaneStore,
  IPlane,
} from './state/plane';
import FreeFlow from './components/planes/FreeFlow';
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
    };
    asyncChange();
  }, [fetchPlanes, changeToPlaneView, changePlane]);

  const getDisplayComponent = (plane: IPlane, view: View) => {
    if (view === View.Plane && plane) {
      if (plane.plane_type === 'linear') {
        return <Linear key={plane.id} plane={plane} />;
      } else {
        return <FreeFlow key={plane.id} plane={plane} />;
      }
    } else if (view === View.Create) {
      return <NewPlane />;
    } else {
      return <Introduction />;
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0f0f0f] flex">
      <Sidebar />
      {getDisplayComponent(displayedPlane!, displayedView!)}
    </div>
  );
}

export default App;
