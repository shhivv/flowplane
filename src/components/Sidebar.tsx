import { BsPlusLg } from "react-icons/bs";
import { MdBlurLinear } from "react-icons/md";
import { GiBlackHoleBolas } from "react-icons/gi";

import {
  useLoadedPlanesStore,
  IPlane,
  useMainDisplayedPlane,
} from "../state/plane";
import { useViewStore } from "../state/view";
import { invoke } from "@tauri-apps/api";

export default function SideBar() {
  const planes = useLoadedPlanesStore((l) => l.planes).sort(
    (a, b) => a.created_at! - b.created_at!,
  );

  const changePlane = useMainDisplayedPlane((c) => c.setPlaneId);

  const changeToPlaneView = useViewStore((v) => v.setPlane);
  const changeToCreateView = useViewStore((v) => v.setCreate);

  const newPlane = () => {
    changeToCreateView();
  };

  const changePlaneOnClick = async (plane: IPlane) => {
    changeToPlaneView();
    await invoke("set_last_accessed", { planeId: plane.id });
    changePlane(plane.id!);
  };

  return (
    <div className="h-screen w-1/6 bg-background border-r border-r-border text-sm flex flex-col">
      <div className="font-heading py-6 font-bold text-lg px-5 flex items-center gap-2 text-foreground">
        <div className="hidden lg:flex">Flowplane</div>
      </div>
      <div className="text-muted-foreground h-full overflow-y-auto px-4">
        {planes.map((plane) => (
          <button
            className="flex items-center space-x-3  hover:bg-accent px-1 py-2 w-full rounded-md"
            key={plane.id}
            onClick={() => {
              changePlaneOnClick(plane);
            }}
          >
            {plane.plane_type === "linear" ? (
              <MdBlurLinear />
            ) : (
              <GiBlackHoleBolas />
            )}{" "}
            <span className="w-4/5 flex">
              <h1 className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                {plane.title}
              </h1>
            </span>
          </button>
        ))}
      </div>

      <button
        className="left-0 text-muted-foreground py-4 mt-auto flex items-center space-x-4 bg-inherit hover:bg-accent w-full px-4"
        onClick={newPlane}
      >
        <BsPlusLg /> <span>New plane</span>
      </button>
    </div>
  );
}
