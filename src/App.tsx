import React, { useEffect, useState } from "react";
import NewPlane from "./components/NewPlane";
import Linear from "./components/planes/Linear";
import Sidebar from "./components/Sidebar";
import { invoke } from "@tauri-apps/api";

import { useViewStore, View } from "./state/view";
import { useLoadedPlanesStore, useMainDisplayedPlane } from "./state/plane";
import Slate from "./components/planes/Slate";
import Introduction from "./components/Intro";

function App() {
  const fetchPlanes = useLoadedPlanesStore((lp) => lp.fetch);
  const planes = useLoadedPlanesStore((lp) => lp.planes);

  const displayedView = useViewStore((v) => v.view);
  const changeToPlaneView = useViewStore((v) => v.setPlane);

  const { planeId, setPlaneId } = useMainDisplayedPlane();

  useEffect(() => {
    const asyncChange = async () => {
      const fetched = await fetchPlanes();

      if (fetched.planes.length !== 0) {
        changeToPlaneView();
        const last = fetched.lastAccessed!.id!;
        await invoke("set_last_accessed", { planeId: last });
        setPlaneId(last);
      }
      await invoke("jsdebug", {
        msg: "start rendering app",
      });
    };
    asyncChange();
  }, [fetchPlanes, changeToPlaneView, setPlaneId]);

  const getDisplayComponent = (_planeId: number, view: View) => {
    const plane = planes.find((obj) => obj.id === _planeId);

    if (view === View.Plane && plane) {
      if (plane.plane_type === "linear") {
        return (
          <div className="w-4/5">
            <Linear key={plane.id} plane={plane} floating={false} />;
          </div>
        );
      } else if (plane.plane_type === "slate") {
        return (
          <div className="w-4/5">
            <Slate key={plane.id} plane={plane} />;
          </div>
        );
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
      {getDisplayComponent(planeId, displayedView!)}
    </div>
  );
}

export default App;
