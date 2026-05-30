import { Outlet, Link } from "react-router-dom";

const App = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            crisistrade
          </Link>
          <nav className="flex gap-4 text-sm text-gray-600"></nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
