import { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../../components/Navbar";
import UserDrawer from "./aside/UserDrawer";
import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import Footer from "../../components/footer";

const UserDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-black bg-gray-50">
      <Navbar />

      {/* Top Bar */}
      <div className="flex items-center px-6 py-4 bg-white shadow-md border-b border-gray-200">
        {/* Toggle Button - Mobile Only */}
        <button
          className="text-black text-2xl lg:hidden"
          onClick={handleDrawerToggle}
          aria-label="Toggle drawer"
        >
          {drawerOpen ? <IoCloseSharp /> : <FaBars />}
        </button>

        <h1 className="text-blue-600 text-2xl font-bold ml-4">My Dashboard</h1>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 z-50 h-full w-64 bg-blue-900 text-white shadow-2xl
            transition-transform duration-300 ease-in-out
            ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:block
          `}
        >
          {/* Close Button - Mobile Only */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={handleDrawerToggle}
              className="text-white text-2xl"
              aria-label="Close drawer"
            >
              <IoCloseSharp />
            </button>
          </div>

          <UserDrawer />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white min-h-screen rounded-tl-3xl shadow-inner">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
