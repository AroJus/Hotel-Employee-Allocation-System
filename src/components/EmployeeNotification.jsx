import React, { useState } from "react";
import useNotification from "../hook/useNotification";
import { useAuth } from "../context/AuthContext";

const LOAD_SIZE = 5;

export default function EmployeeNotification() {
  const { notifications, loading } = useNotification();
  const { employee } = useAuth();

  // Filter notifications for the logged-in employee
  const employeeNotifications = notifications.filter(
    (notif) => notif.employee === employee?.empname
  );

  // Load more state
  const [visibleCount, setVisibleCount] = useState(LOAD_SIZE);
  const visibleNotifications = employeeNotifications.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + LOAD_SIZE, employeeNotifications.length)
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto h-full flex flex-col justify-start">
      <div className="border-b-1 border-gray-300 pb-3 mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
          My Notifications
        </h1>
      </div>
      <div className="flex-grow">
        {loading ? (
          <div className="text-gray-600 text-center flex-grow flex justify-center">
            <p className="text-sm sm:text-base">Loading notifications...</p>
          </div>
        ) : employeeNotifications.length === 0 ? (
          <div className="text-gray-600 text-center flex-grow flex justify-center">
            <p className="text-sm sm:text-base">
              No notifications available at the moment.
            </p>
          </div>
        ) : (
          <>
            <ul className="space-y-2">
              {visibleNotifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`p-4 rounded-lg shadow-md flex flex-col  ${
                    notif.read ? "bg-gray-500" : "bg-white"
                  }`}
                >
                  <div className="font-semibold">{notif.title}</div>
                  <div className="text-gray-700">{notif.message}</div>
                  <div className="text-xs text-gray-400">{notif.time}</div>
                </li>
              ))}
            </ul>
            {visibleCount < employeeNotifications.length && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}