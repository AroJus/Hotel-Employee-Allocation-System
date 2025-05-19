import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";

export default function EmployeeDashboard() {
  const { employee, employeeLogout } = useAuth();

  if (!employee) {
    return <div className="text-center mt-10">Not logged in.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {employee.empname}!</h1>
      <p className="mb-6">Position: {employee.jobposition}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Link
          to="/employee-task"
          className="bg-blue-100 hover:bg-blue-200 p-6 rounded-lg shadow text-center transition"
        >
          <div className="text-lg font-semibold mb-2">My Tasks</div>
          <div className="text-gray-600 text-sm">View your assigned tasks</div>
        </Link>
        <Link
          to="/employee-schedule"
          className="bg-green-100 hover:bg-green-200 p-6 rounded-lg shadow text-center transition"
        >
          <div className="text-lg font-semibold mb-2">My Schedule</div>
          <div className="text-gray-600 text-sm">See your work schedule</div>
        </Link>
        <Link
          to="/employee-notification"
          className="bg-yellow-100 hover:bg-yellow-200 p-6 rounded-lg shadow text-center transition"
        >
          <div className="text-lg font-semibold mb-2">Notifications</div>
          <div className="text-gray-600 text-sm">Check your notifications</div>
        </Link>
      </div>
    </div>
  );
}