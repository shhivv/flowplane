import React, { useEffect } from 'react';
import NewPlane from './components/NewPlane';
import Linear from './components/planes/Linear';
import Sidebar from './components/Sidebar';

import { useViewStore, View } from './state/view';
import { useLoadedPlanesStore, useDisplayedPlaneStore } from './state/plane';
import FreeFlow from './components/planes/FreeFlow';
import Introduction from './components/Intro';

function App() {
  const displayedPlane = useDisplayedPlaneStore((dp) => dp.plane);
  const changePlane = useDisplayedPlaneStore((dp) => dp.changePlane);


  const fetchPlanes = useLoadedPlanesStore((lp) => lp.fetch);


  const displayedView = useViewStore((v) => v.view);
  const changeToPlaneView = useViewStore((v) => v.setPlane);


  useEffect(() => {
    const fetched = fetchPlanes();
    const asyncChange = async () => {
      const last_accessed = await fetched.then(planes => planes.sort((a, b) => b.last_accessed! - a.last_accessed!)).then(planes => planes[0]);

      changeToPlaneView();
      await changePlane(last_accessed);
    };
    asyncChange();
  }, [fetchPlanes, changeToPlaneView, changePlane]);

  const getDisplayComponent = (view?: View) => {
    if (view === View.Plane) {
      if (displayedPlane?.plane_type === 'linear') {
        return <Linear plane={displayedPlane} />;
      } else {
        return <FreeFlow plane={displayedPlane} />;
      }
    } else if (view === View.Create) {
      return <NewPlane />;
    }else{
      return <Introduction/>;
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0f0f0f] flex">
      <Sidebar />
      {getDisplayComponent(displayedView)}
    </div>
  );
}

export default App;
