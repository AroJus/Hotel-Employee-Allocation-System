import React from "react";
import useEmployee from "../hook/useEmployee";
import useTask from "../hook/useTask";
import useSchedule from "../hook/useSchedule";
import { Users, Clipboard, Calendar, Loader2 } from "lucide-react";
import { NavLink } from "react-router";

export default function Dashboard() {
  const { employees, loading: employeeLoading } = useEmployee();
  const { tasks, loading: taskLoading } = useTask();
  const { schedules, loading: scheduleLoading } = useSchedule();

  // number of employees assigned to schedules
  const employeesAssignedToSchedules = schedules.filter(
    (schedule) =>
      schedule.employee_assigned !== null && schedule.employee_assigned !== ""
  ).length;

  const stats = [
    {
      label: "Employees",
      value: employees.length,
      icon: <Users className="w-8 h-8" />,
      nav: "/employee",
    },
    {
      label: "Tasks",
      value: tasks.length,
      icon: <Clipboard className="w-8 h-8" />,
      nav: "/task",
    },
    {
      label: "Assigned to Schedules",
      value: employeesAssignedToSchedules,
      icon: <Calendar className="w-8 h-8" />,
      nav: "/schedule",
    },
  ];

  // Check if any data is still loading
  const isLoading = employeeLoading || taskLoading || scheduleLoading;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="border-b-1 border-gray-300 pb-3 mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <span className="ml-4 text-lg text-gray-600">
            Loading dashboard data...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <NavLink to={stat.nav}>
              <div
                key={index}
                className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-20 h-20 bg-gradient-to-br bg-yellow-500  rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6">
                  {stat.icon}
                  <span className="ml-2">{stat.value}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 text-center capitalize">
                  {stat.label}
                </h2>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
