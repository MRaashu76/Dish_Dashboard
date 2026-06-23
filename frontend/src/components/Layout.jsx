import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50 h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col relative">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
