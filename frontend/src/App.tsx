import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="min-h-screen w-full">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
