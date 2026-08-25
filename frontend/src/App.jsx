import "./App.css";
import Menu from "./Components/Menu";

function App() {
  return (
    <>
      <div className="w-screen h-screen">
        <div className="" flex flex-col justify-center>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center">
            <Menu />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
