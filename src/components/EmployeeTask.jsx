import React from "react";
import useTask from "../hook/useTask";
import { useAuth } from "../context/AuthContext";

export default function EmployeeTask() {
  const { tasks, loading } = useTask();
  const { employee } = useAuth();

  // Filter tasks assigned to the logged-in employee
  const employeeTasks = tasks.filter((task) => {
    // task.employee_assigned can be an object or an ID
    if (!task.employee_assigned || !employee) return false;
    if (typeof task.employee_assigned === "object") {
      return task.employee_assigned.id === employee.id;
    }
    return String(task.employee_assigned) === String(employee.id);
  });

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto h-full flex flex-col justify-start">
      <div className="border-b-1 border-gray-300 pb-3 mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
          My Tasks
        </h1>
      </div>
      <div className="flex-grow">
        {loading ? (
          <div className="text-gray-600 text-center flex-grow flex justify-center">
            <p className="text-sm sm:text-base">Loading tasks...</p>
          </div>
        ) : employeeTasks.length === 0 ? (
          <div className="text-gray-600 text-center flex-grow flex justify-center">
            <p className="text-sm sm:text-base">
              No tasks assigned to you at the moment.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {employeeTasks.map((task) => (
              <li
                key={task.id}
                className="p-4 rounded-lg shadow bg-yellow-50 flex flex-col"
              >
                <div className="font-semibold">{task.taskname}</div>
                <div className="text-xs text-gray-400">Task ID: {task.id}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}