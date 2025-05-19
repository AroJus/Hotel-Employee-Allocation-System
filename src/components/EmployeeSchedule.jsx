import React from "react";
import useSchedule from "../hook/useSchedule";
import { useAuth } from "../context/AuthContext";
import { Download, DownloadIcon, FileDown } from "lucide-react";

// Time slots as ranges (should match admin)
const timeSlots = [
  { label: "6:00 AM - 9:00 AM", start: "6:00 AM", end: "9:00 AM" },
  { label: "9:00 AM - 12:00 PM", start: "9:00 AM", end: "12:00 PM" },
  { label: "12:00 PM - 12:30 PM", start: "12:00 PM", end: "12:30 PM" },
  { label: "12:30 PM - 3:00 PM", start: "12:30 PM", end: "3:00 PM" },
  { label: "3:00 PM - 6:00 PM", start: "3:00 PM", end: "6:00 PM" },
  { label: "6:00 PM", start: "6:00 PM", end: null },
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Format time (e.g., "13:00" -> "1:00 PM")
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hourStr, minuteStr] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr || "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

// Helper to check if a time is within a slot's range
function isTimeInRange(time, start, end) {
  const toMinutes = (t) => {
    if (!t) return null;
    let [h, m] = t.split(":");
    let ampm = m.slice(-2);
    m = m.replace(/[^0-9]/g, "");
    h = parseInt(h, 10);
    m = parseInt(m, 10);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };
  const timeMin = toMinutes(time);
  const startMin = toMinutes(start);
  const endMin = end ? toMinutes(end) : startMin;
  return timeMin >= startMin && timeMin < endMin;
}

export default function EmployeeSchedule() {
  const { schedules, loading } = useSchedule();
  const { employee } = useAuth();

  // Filter schedules assigned to the logged-in employee
  const employeeSchedules = schedules.filter((schedule) => {
    if (!schedule.employee_assigned || !employee) return false;
    if (typeof schedule.employee_assigned === "object") {
      return schedule.employee_assigned.id === employee.id;
    }
    return String(schedule.employee_assigned) === String(employee.id);
  });

  // Build a matrix: { [slot.label]: { [day]: true/false } }
  const matrix = {};
  for (const slot of timeSlots) {
    matrix[slot.label] = {};
    for (const day of days) {
      matrix[slot.label][day] = false;
    }
  }
  employeeSchedules.forEach((schedule) => {
    const time = formatTime(schedule.time);
    const scheduleDays = schedule.days
      ? schedule.days.split(",").map((d) => d.trim())
      : [];
    // Find the slot where schedule.time falls within the slot's range
    const slot = timeSlots.find((s) => isTimeInRange(time, s.start, s.end));
    if (slot) {
      scheduleDays.forEach((day) => {
        if (matrix[slot.label][day] !== undefined) {
          matrix[slot.label][day] = true;
        }
      });
    }
  });

  // Export schedule as CSV
  const handleExport = () => {
    if (employeeSchedules.length === 0) return;
    const header = ["Time", "Days"];
    const rows = employeeSchedules.map((sched) => [
      formatTime(sched.time),
      sched.days,
    ]);
    let csvContent =
      header.join(",") +
      "\n" +
      rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

    // Download as file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my_schedule.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto h-full flex flex-col justify-start">
      <div className="border-b-1 border-gray-300 pb-3 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
          My Schedule
        </h1>
        <button
          onClick={handleExport}
          className="flex items-center gap-1 mt-4 sm:mt-0 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
          disabled={employeeSchedules.length === 0}
        >
            <FileDown className="w-5 h-5" />
          Export Schedule
        </button>
      </div>
      <div className="flex-grow">
        {loading ? (
          <div className="text-gray-600 text-center flex-grow flex justify-center">
            <p className="text-sm sm:text-base">Loading schedules...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto shadow-md rounded-lg mb-8">
              <table className="min-w-full border text-xs sm:text-sm">
                <thead>
                  <tr>
                    <th className="border px-2 py-2 bg-gray-100">TIME</th>
                    {days.map((day) => (
                      <th key={day} className="border px-2 py-2 bg-gray-100">
                        {day.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot.label}>
                      <td className="border px-2 py-2 font-semibold bg-gray-50">{slot.label}</td>
                      {days.map((day) => (
                        <td
                          key={day}
                          className="border px-2 py-2 align-top min-w-[80px] text-center"
                        >
                          {matrix[slot.label][day] ? (
                            <span className="text-green-700 font-semibold">✔</span>
                          ) : (
                            ""
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Detailed schedule */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Detailed Schedule</h2>
              {employeeSchedules.length === 0 ? (
                <div className="text-gray-500 text-center">No schedule assigned.</div>
              ) : (
                <ul className="space-y-4">
                  {employeeSchedules.map((sched) => (
                    <li
                      key={sched.id}
                      className="p-4 rounded-lg shadow bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <span className="font-semibold">Time: </span>
                        {formatTime(sched.time)}
                      </div>
                      <div>
                        <span className="font-semibold">Days: </span>
                        {sched.days}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}