import { BsTrashFill } from 'react-icons/bs';
import {
  IPlane,
  useDisplayedPlaneStore,
  useLoadedPlanesStore,
} from '../state/plane';
import { useViewStore } from '../state/view';

interface IDeletePlane {
  plane: IPlane;
}

export default function DeletePlane({ plane }: IDeletePlane) {
  const deletePlane = useDisplayedPlaneStore((dp) => dp.deletePlane);
  const changePlane = useDisplayedPlaneStore((dp) => dp.changePlane);

  const changeToIntro = useViewStore((v) => v.setIntro);

  const fetch = useLoadedPlanesStore((lp) => lp.fetch);

  const onClick = async () => {
    await deletePlane(plane);
    const fetched = await fetch();

    if (fetched.lastAccessed) {
      changePlane(fetched.lastAccessed!);
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
