import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router"; 
import {
  Home,
  Users,
  Clipboard,
  Calendar,
  Bell,
  User,
  LogOut,
  User2,
} from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

export default function SideBar() {
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  // Define the base and active styles for NavLink
  const linkClassName = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
      isActive ? "bg-yellow-500 text-white" : "hover:bg-gray-400 hover:text-white"
    }`;

  return (
    <div className="flex-shrink-0 w-full sm:w-64  min-h-screen  shadow-xl">
      <ul className="flex flex-col gap-3 p-6 h-full">
        {user && (
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 pb-5 px-3 mb-1 border-b text-sm hover:text-red-400 transition-colors duration-200 focus:outline-none"
            >
              <User2 className="w-5 h-5" />
              Logged in as: {user.username || "User"}
            </button>
          </li>
        )}
        <li className="group">
          <NavLink to="/dashboard" className={linkClassName}>
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="group">
          <NavLink to="/employee" className={linkClassName}>
            <Users className="w-5 h-5" />
            <span>Employee Manager</span>
          </NavLink>
        </li>
        <li className="group">
          <NavLink to="/task" className={linkClassName}>
            <Clipboard className="w-5 h-5" />
            <span>Task Manager</span>
          </NavLink>
        </li>
        <li className="group">
          <NavLink to="/schedule" className={linkClassName}>
            <Calendar className="w-5 h-5" />
            <span>Schedule Manager</span>
          </NavLink>
        </li>
        <li className="group">
          <NavLink to="/notification" className={linkClassName}>
            <Bell className="w-5 h-5" />
            <span>Notification</span>
          </NavLink>
        </li>
        <li className="group">
          <NavLink to="/user" className={linkClassName}>
            <User className="w-5 h-5" />
            <span>User Manager</span>
          </NavLink>
        </li>
      </ul>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </div>
  );
}