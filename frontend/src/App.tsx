import { Outlet } from "react-router-dom";
import { MainNavbar } from "./components/MainNavbar";

const App = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-page">
      <MainNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
