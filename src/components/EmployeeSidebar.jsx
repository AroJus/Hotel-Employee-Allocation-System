import React, { useState } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Home, Clipboard, Calendar, Bell, User2, LogOut } from "lucide-react";

export default function EmployeeSideBar() {
  const { employee, employeeLogout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    employeeLogout();
    setIsLogoutModalOpen(false);
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const linkClassName = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
      isActive ? "bg-yellow-500 text-white" : "hover:bg-gray-400 hover:text-white"
    }`;

  return (
    <div className="flex-shrink-0 w-full sm:w-64 min-h-screen shadow-xl">
      <ul className="flex flex-col gap-3 p-6 h-full">
        {employee && (
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 pb-5 px-3 mb-1 border-b text-sm hover:text-yellow-500 transition-colors duration-200 focus:outline-none"
            >
              <User2 className="w-5 h-5" />
              Logged in as: {employee.empname}
            </button>
          </li>
        )}
        <li className="group">
          <NavLink to="/employee-dashboard" className={linkClassName}>
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="group">
          <NavLink to="/employee-task" className={linkClassName}>
            <Clipboard className="w-5 h-5" />
            <span>Task</span>
          </NavLink>
        </li>
        <li className="group">
          <NavLink to="/employee-schedule" className={linkClassName}>
            <Calendar className="w-5 h-5" />
            <span>Schedule</span>
          </NavLink>
        </li>
        <li className="group">
          <NavLink to="/employee-notification" className={linkClassName}>
            <Bell className="w-5 h-5" />
            <span>Notification</span>
          </NavLink>
        </li>
      </ul>
      {/* Simple logout modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
