import HeaderMain from "./HeaderMain";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Logout from "../authentication/Logout";

function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`grid grid-rows-[auto_1fr] h-screen overflow-hidden transition-all duration-300 ${
        isCollapsed
          ? "grid-cols-[0rem_1fr]" // Collapse sidebar
          : "grid-cols-[16rem_1fr]" // Expanded sidebar
      }`}
    >
      <HeaderMain>
        <Logout />
      </HeaderMain>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Outlet />
    </div>
  );
}

export default AppLayout;
