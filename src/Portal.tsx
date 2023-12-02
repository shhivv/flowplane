import { useEffect, useState } from "react";
import Linear from "./components/planes/Linear";
import { IPlane, useDisplayedPlaneStore, useLoadedPlanesStore } from "./state/plane";

export default function Portal() {
  const [plane, setPlane] = useState<IPlane>();
  const fetchPlanes = useLoadedPlanesStore((lp) => lp.fetch);
  const [i, setI] = useState(0);

  useEffect(() => {
    const asyncChange = async () => {
      const fetched = await fetchPlanes();
      console.log(fetched.planes);
      setPlane(fetched.lastAccessed!);
    };
    asyncChange();
    setI(p => p + 1);
  }, [fetchPlanes]);

  return <div className="w-screen h-screen flex bg-gradient-to-r from-violet-500/20 to-violet-500/10 ">
    { plane && <Linear plane={plane!} key={plane!.id} floating/>}
  </div>;
}

