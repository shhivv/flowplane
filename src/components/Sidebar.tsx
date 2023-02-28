import { BsPlusLg } from "react-icons/bs";
import { MdBlurLinear } from "react-icons/md";
import { GiBlackHoleBolas } from "react-icons/gi";
import { useRecoilState } from "recoil";
import { loadedPlanesState, displayedViewState, View } from "../state";

export default function () {
  const [loadedPlanes, _setLoadedPlanes] = useRecoilState(loadedPlanesState);
  const [_displayedView, setdisplayedView] = useRecoilState(displayedViewState);

  const newPlane = () => {
    setdisplayedView(View.Create)
  }

  return (
    <div className="h-screen w-1/6 bg-[#111] border-r border-r-neutral-800 p-4 text-sm">
      <div className="py-2">
        <div className="font-heading mb-8 text-lg px-1 text-neutral-300">
          Flowplane
        </div>
        <div className="text-neutral-400">
          {loadedPlanes.map((plane) => (
            <div className="flex items-center space-x-3  hover:bg-neutral-900 p-1 w-full  rounded-md">
              {plane.plane_type === "Linear" ? (
                <MdBlurLinear />
              ) : (
                <GiBlackHoleBolas />
              )}{" "}
              <span>{plane.title}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="bottom-0 text-neutral-400 fixed py-3 px-6 flex items-center space-x-4 hover:bg-neutral-900 left-0 w-1/6" onClick={newPlane}>
        <BsPlusLg /> <span>New plane</span>
      </button>
    </div>
  );
}
