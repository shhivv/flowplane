import { BsTrashFill } from "react-icons/bs";
import {
  IPlane,
  useMainDisplayedPlane,
  useLoadedPlanesStore,
} from "../state/plane";
import { useViewStore } from "../state/view";
import { invoke } from "@tauri-apps/api";

interface IDeletePlane {
  plane: IPlane;
}

export default function DeletePlane({ plane }: IDeletePlane) {
  const changeToIntro = useViewStore((v) => v.setIntro);

  const fetch = useLoadedPlanesStore((lp) => lp.fetch);
  const changePlane = useMainDisplayedPlane((c) => c.setPlaneId);
  const onClick = async () => {
    await invoke("delete_plane", { planeId: plane.id! });
    const fetched = await fetch();

    if (fetched.lastAccessed) {
      changePlane(fetched.lastAccessed!.id!);
    } else {
      changeToIntro();
    }
  };
  return (
    <button>
      <BsTrashFill
        onClick={onClick}
        className="hover:text-red-400 text-sm rounded-md"
      />
    </button>
  );
}
