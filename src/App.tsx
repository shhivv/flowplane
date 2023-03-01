import { useEffect } from "react";
import { useRecoilState } from "recoil";
import NewPlane from "./components/NewPlane";
import Infinite from "./components/planes/FreeFlow";
import Linear from "./components/planes/Linear";
import Sidebar from "./components/Sidebar";
import { invoke } from "@tauri-apps/api";
import {
  loadedPlanesState,
  displayedPlaneState,
  displayedViewState,
  View,
  IPlane,
} from "./state";
import FreeFlow from "./components/planes/FreeFlow";

function App() {
  const [loadedPlanes, setLoadedPlanes] = useRecoilState(loadedPlanesState);
  const [displayedPlane, setdisplayedPlane] =
    useRecoilState(displayedPlaneState);
  const [displayedView, setdisplayedView] = useRecoilState(displayedViewState);

  // TODO: fix types
  useEffect(() => {
    invoke("get_planes").then((planes) => {
      setLoadedPlanes(planes as any);
      setdisplayedPlane(
        (planes as IPlane[]).filter((i) => i.last_opened == true)[0]
      );
    });
  }, []);

  const getDisplayComponent = (displayedView: View) => {
    if (displayedView == View.Plane) {
      if(displayedPlane?.plane_type == "linear"){
        return <Linear plane={displayedPlane}/>
      }else{
        return <FreeFlow plane={displayedPlane}/>
      }
    } else {
      return <NewPlane />;
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
