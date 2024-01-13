import { useEffect, useState } from "react";
import Linear from "./components/planes/Linear";
import { IPlane, useLoadedPlanesStore } from "./state/plane";
import PortalInfo from "./components/PortalInfo";

export default function Portal() {
  const [plane, setPlane] = useState<IPlane>();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-screen h-screen overflow-hidden relative card flex items-center justify-center p-[2px] rounded-lg">
      <div className="bg" />
      <div className="relative flex flex-col w-full h-full bg-background rounded-lg">
        <div className="overflow-y-auto flex-1"></div>
        <div className="bg-fuchsia-900/10 border-t border-neutral-800 border-dashed rounded-b-lg h-10">
          <PortalInfo />
        </div>
      </div>
    </div>
  );
}
