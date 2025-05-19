import React from "react";
import EmployeeSideBar from "./EmployeeSideBar";

export default function EmployeeLayout({ children }) {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Employee Sidebar */}
        <EmployeeSideBar />
        {/* Main content */}
        <div className="flex-1 p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
