import { useEffect, useState } from "react";
import PortalInfo from "./components/PortalInfo";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IPlane, useLoadedPlanesStore } from "./state/plane";
import Linear from "./components/planes/Linear";
import Slate from "./components/planes/Slate";
import Introduction from "./components/Intro";

export default function Portal() {
  const fetchPlanes = useLoadedPlanesStore((lp) => lp.fetch);
  const [planeId, setPlaneId] = useState(Number(localStorage.getItem("portalPlane")) || 0);
  const planes = useLoadedPlanesStore((lp) => lp.planes);

  useEffect(() => {
    async function cback() {
      await fetchPlanes();
    }

    cback();
  }, [fetchPlanes]);

    const getDisplayComponent = (_planeId: number) => {
    const plane = planes.find((obj) => obj.id === _planeId);

    if (plane) {
      if (plane.plane_type === "linear") {
        return (
            <Linear key={plane.id} plane={plane} floating />
        );
      } else if (plane.plane_type === "slate") {
        return (
            <Slate key={plane.id} plane={plane} floating />
        );
      }
    } else {
      return <div className="flex h-full justify-center w-full">
        <Introduction/>
      </div>;
    }
  };

  const onChange = (id: string) => {
    setPlaneId(Number(id));
    localStorage.setItem("portalPlane", id);
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative card flex dark items-center justify-center p-[2px] rounded-lg font-sans">
      <div className="bg" />
      <div className="relative flex flex-col w-full h-full bg-background rounded-lg">
        <div className="overflow-y-hidden flex-1">
          {getDisplayComponent(planeId)}
        </div>
        <div className="bg-primary/10 border-t border-border border-dashed rounded-b-lg h-14 flex items-center justify-between">
        <Select onValueChange={onChange} defaultValue={String(planeId)} >
  <SelectTrigger className="w-40 mx-12 bg-primary/20 text-primary-foreground h-8 border-primary/40 ">
    <SelectValue placeholder="Plane" />
  </SelectTrigger>
  <SelectContent>
    {planes.map(i => <SelectItem value={String(i.id)} key={i.id}>{i.title}</SelectItem>)}
  </SelectContent>
</Select>
          <PortalInfo />
        </div>
      </div>
    </div>
  );
}
