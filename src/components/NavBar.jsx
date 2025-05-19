import React from 'react';

export default function NavBar() {
  return (
    <div className="flex flex-row p-1 bg-red-800 w-full shadow">
      <div
        className="m-1 mr-5 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-cover bg-center"
        style={{ backgroundImage: "url('/src/images/logo.png')" }}
      ></div>
      <div>
        <h1 className="text-yellow-400 font-bold font-mono text-2xl sm:text-3xl">Golden Park Inn Hotel</h1>
        <h2 className="text-yellow-400 font-bold font-mono text-base sm:text-lg">Employee Allocation System</h2>
      </div>
    </div>
  );
}