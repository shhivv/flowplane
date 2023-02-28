import Infinite from "./components/planes/Infinite";
import Linear from "./components/planes/Linear";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="w-screen h-screen bg-[#0f0f0f] flex">
      <Sidebar/>
      <Linear/>
    </div>
  );
}

export default App;
