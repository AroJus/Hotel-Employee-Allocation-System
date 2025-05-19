import React from 'react';
import NavBar from './NavBar';
import SideBar from './SideBar';

export default function Layout({ children }) {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      {/* Heading */}
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideBar />
        {/* Main content */}
        <div className="flex-1 p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 