import React, { useState } from "react";
import Modals from "./Modals";
import ConfirmationModal from "./ConfirmationModal";
import { Calendar, AlertCircle, Edit2, Trash } from "lucide-react";
import { toast } from "react-toastify";

// Time slots as ranges
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

// Helper to format time from "HH:mm:ss" or "HH:mm" to "h:mm AM/PM"
function formatTime(timeStr) {
  if (!timeStr) return "";
  const [hourStr, minuteStr] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr || "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

// Helper to get employee name from ID or object
function getEmployeeName(employeeAssigned, employees) {
  if (!employeeAssigned) return "";
  if (typeof employeeAssigned === "object" && employeeAssigned.empname) {
    return employeeAssigned.empname;
  }
  const employee = employees.find((emp) => emp.id === employeeAssigned);
  return employee ? employee.empname : "";
}

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

// Helper for days dropdown
const allDays = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

// Helper to convert days array to string
function daysArrayToString(arr) {
  return arr.map(
    d => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()
  ).join(", ");
}

// Build a lookup: { [slot.label]: { [day]: [employee names] } }
function buildScheduleMatrix(schedules, employees) {
  const matrix = {};
  for (const slot of timeSlots) {
    matrix[slot.label] = {};
    for (const day of days) {
      matrix[slot.label][day] = [];
    }
  }
  schedules.forEach((schedule) => {
    const time = formatTime(schedule.time);
    const scheduleDays = schedule.days
      ? schedule.days.split(",").map((d) => d.trim())
      : [];
    const empName = getEmployeeName(schedule.employee_assigned, employees);
    // Find the slot where schedule.time falls within the slot's range
    const slot = timeSlots.find((s) => isTimeInRange(time, s.start, s.end));
    if (slot) {
      scheduleDays.forEach((day) => {
        if (matrix[slot.label] && matrix[slot.label][day]) {
          matrix[slot.label][day].push(empName);
        }
      });
    }
  });
  return matrix;
}

export default function ScheduleManagement({
  schedules,
  employees,
  es_assigned,
  setEs_assigned,
  time,
  setTime,
  days: daysInput,
  setDays,
  isAddModalsOpen,
  setIsAddModalsOpen,
  isEditModalsOpen,
  setIsEditModalsOpen,
  addSchedule,
  editSchedule,
  updateSchedule,
  deleteSchedule,
}) {
  const [addErrors, setAddErrors] = useState({ time: "", days: "" });
  const [editErrors, setEditErrors] = useState({ time: "", days: "" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  // Confirmation modals
  const [isAddConfirmOpen, setIsAddConfirmOpen] = useState(false);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);

  // For dropdown days selection
  const [selectedDays, setSelectedDays] = useState([]);
  const [editSelectedDays, setEditSelectedDays] = useState([]);

  // Sync daysInput <-> selectedDays for Add
  React.useEffect(() => {
    if (!isAddModalsOpen) setSelectedDays([]);
    else if (daysInput) {
      setSelectedDays(
        daysInput
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean)
      );
    }
  }, [isAddModalsOpen, daysInput]);

  // Sync daysInput <-> editSelectedDays for Edit
  React.useEffect(() => {
    if (!isEditModalsOpen) setEditSelectedDays([]);
    else if (daysInput) {
      setEditSelectedDays(
        daysInput
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean)
      );
    }
  }, [isEditModalsOpen, daysInput]);

  const handleDayToggle = (day, isEdit = false) => {
    if (isEdit) {
      setEditSelectedDays((prev) =>
        prev.includes(day)
          ? prev.filter((d) => d !== day)
          : [...prev, day]
      );
    } else {
      setSelectedDays((prev) =>
        prev.includes(day)
          ? prev.filter((d) => d !== day)
          : [...prev, day]
      );
    }
  };

  const openAddModals = () => setIsAddModalsOpen(true);
  const closeAddModals = () => {
    setIsAddModalsOpen(false);
    setEs_assigned("");
    setTime("");
    setDays("");
    setAddErrors({ time: "", days: "" });
    setSelectedDays([]);
  };

  const openEditModals = (schedule) => {
    editSchedule(schedule);
  };

  const closeEditModals = () => {
    setIsEditModalsOpen(false);
    setEs_assigned("");
    setTime("");
    setDays("");
    setEditErrors({ time: "", days: "" });
    setEditSelectedDays([]);
  };

  const validateForm = (isEdit = false) => {
    let isValid = true;
    const newErrors = { time: "", days: "" };
    const daysArr = isEdit ? editSelectedDays : selectedDays;

    if (!time) {
      newErrors.time = "Time is required";
      isValid = false;
    }
    if (!daysArr.length) {
      newErrors.days = "Please select at least one day.";
      isValid = false;
    }

    if (isEdit) {
      setEditErrors(newErrors);
    } else {
      setAddErrors(newErrors);
    }
    return isValid;
  };

  // Add Schedule with confirmation
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setDays(daysArrayToString(selectedDays));
      setIsAddConfirmOpen(true);
    }
  };

  const confirmAdd = async () => {
    try {
      await addSchedule();
      toast.success("Schedule added successfully!");
      closeAddModals();
    } catch (err) {
      toast.error("Failed to add schedule");
    }
    setIsAddConfirmOpen(false);
  };

  // Edit Schedule with confirmation
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (validateForm(true)) {
      setDays(daysArrayToString(editSelectedDays));
      setIsEditConfirmOpen(true);
    }
  };

  const confirmEdit = async () => {
    try {
      await updateSchedule();
      toast.success("Schedule updated successfully!");
      closeEditModals();
    } catch (err) {
      toast.error("Failed to update schedule");
    }
    setIsEditConfirmOpen(false);
  };

  const handleDelete = (schedule) => {
    setScheduleToDelete(schedule);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (scheduleToDelete) {
      try {
        await deleteSchedule(scheduleToDelete.id);
        toast.success("Schedule deleted successfully!", {
          position: "top-right",
        });
      } catch (err) {
        toast.error("Failed to delete schedule", {
          position: "top-right",
        });
      }
    }
    setIsDeleteModalOpen(false);
    setScheduleToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setScheduleToDelete(null);
  };

  // --- WEEKLY SCHEDULE TABLE LOGIC ---
  const matrix = buildScheduleMatrix(schedules, employees);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-1 border-gray-300 pb-3 mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left mb-4 sm:mb-0">
          Schedule Manager
        </h1>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto"
          onClick={openAddModals}
        >
          + Add Schedule
        </button>
      </div>

      {/* Weekly Schedule Table */}
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
                <td className="border px-2 py-2 font-semibold bg-gray-50">
                  {slot.label}
                </td>
                {days.map((day) => (
                  <td
                    key={day}
                    className="border px-2 py-2 align-top min-w-[100px]"
                  >
                    {matrix[slot.label][day].length > 0
                      ? matrix[slot.label][day].map((emp, idx) => (
                          <div key={idx}>{emp}</div>
                        ))
                      : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table for CRUD */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table-fixed w-full max-w-full text-xs sm:text-sm text-center text-gray-800">
          <thead className="text-xs uppercase bg-gray-100 text-gray-700">
            <tr>
              <th className="w-1/6 px-2 sm:px-4 py-3 border-b border-gray-200">
                Id
              </th>
              <th className="w-1/4 px-2 sm:px-4 py-3 border-b border-gray-200">
                Employee
              </th>
              <th className="w-1/4 px-2 sm:px-4 py-3 border-b border-gray-200">
                Time
              </th>
              <th className="w-1/4 px-2 sm:px-4 py-3 border-b border-gray-200">
                Days
              </th>
              <th className="w-1/4 px-2 sm:px-4 py-3 border-b border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => {
              let formattedTime = "";
              if (schedule.time) {
                const [hourStr, minuteStr] = schedule.time.split(":");
                let hour = parseInt(hourStr, 10);
                const minute = minuteStr || "00";
                const ampm = hour >= 12 ? "PM" : "AM";
                hour = hour % 12 || 12;
                formattedTime = `${hour}:${minute} ${ampm}`;
              }
              return (
                <tr
                  key={schedule.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-2 sm:px-4 py-4">{schedule.id}</td>
                  <td className="px-2 sm:px-4 py-4">
                    {getEmployeeName(schedule.employee_assigned, employees)}
                  </td>
                  <td className="px-2 sm:px-4 py-4">{formattedTime}</td>
                  <td className="px-6 sm:px-4 py-4">{schedule.days}</td>
                  <td className="flex justify-center items-center space-x-2 mt-2">
                    <button
                      className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto"
                      onClick={() => openEditModals(schedule)}
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      className="flex items-center gap-1 px-6 sm:px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all w-full sm:w-auto"
                      onClick={() => handleDelete(schedule)}
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Schedule Modal */}
      <Modals isOpen={isAddModalsOpen} onClose={closeAddModals}>
        <form
          onSubmit={handleAddSubmit}
          className="p-6 sm:p-8 flex flex-col space-y-6 w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center flex items-center justify-center gap-2">
            <Calendar className="w-6 h-6 text-green-600" />
            Add New Schedule
          </h2>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="es_assigned"
              className="font-medium text-gray-700 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5 text-gray-500" />
              Employee Assigned
            </label>
            <select
              id="es_assigned"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={es_assigned}
              onChange={(e) => setEs_assigned(e.target.value)}
            >
              <option value="">None</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.empname} ({employee.jobposition || "N/A"})
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="time"
              className="font-medium text-gray-700 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5 text-gray-500" />
              Time
            </label>
            <input
              type="time"
              id="time"
              className={`border ${
                addErrors.time ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-invalid={addErrors.time ? "true" : "false"}
              aria-describedby={addErrors.time ? "time-error" : undefined}
            />
            {addErrors.time && (
              <p
                id="time-error"
                className="text-red-500 text-sm flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {addErrors.time}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              Days
            </label>
            <div className="border border-gray-300 rounded-lg p-3 bg-white">
              <div className="flex flex-wrap gap-3">
                {allDays.map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
            {addErrors.days && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {addErrors.days}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Add Schedule
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
              onClick={closeAddModals}
            >
              <AlertCircle className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </form>
        {/* Add Confirmation Modal */}
        <ConfirmationModal
          isOpen={isAddConfirmOpen}
          onClose={() => setIsAddConfirmOpen(false)}
          onConfirm={confirmAdd}
          title="Confirm Add"
          message="Are you sure you want to add this schedule?"
          confirmText="Add"
          cancelText="Cancel"
        />
      </Modals>

      {/* Edit Schedule Modal */}
      <Modals isOpen={isEditModalsOpen} onClose={closeEditModals}>
        <form
          onSubmit={handleEditSubmit}
          className="p-6 sm:p-8 flex flex-col space-y-6 w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center flex items-center justify-center gap-2">
            <Calendar className="w-6 h-6 text-green-600" />
            Edit Schedule
          </h2>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="edit-es_assigned"
              className="font-medium text-gray-700 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5 text-gray-500" />
              Employee Assigned
            </label>
            <select
              id="edit-es_assigned"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={es_assigned}
              onChange={(e) => setEs_assigned(e.target.value)}
            >
              <option value="">None</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.empname} ({employee.jobposition || "N/A"})
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="edit-time"
              className="font-medium text-gray-700 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5 text-gray-500" />
              Time
            </label>
            <input
              type="time"
              id="edit-time"
              className={`border ${
                editErrors.time ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-invalid={editErrors.time ? "true" : "false"}
              aria-describedby={editErrors.time ? "edit-time-error" : undefined}
            />
            {editErrors.time && (
              <p
                id="edit-time-error"
                className="text-red-500 text-sm flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {editErrors.time}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              Days
            </label>
            <div className="border border-gray-300 rounded-lg p-3 bg-white">
              <div className="flex flex-wrap gap-3">
                {allDays.map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editSelectedDays.includes(day)}
                      onChange={() => handleDayToggle(day, true)}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
            {editErrors.days && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {editErrors.days}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Update Schedule
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
              onClick={closeEditModals}
            >
              <AlertCircle className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </form>
        {/* Edit Confirmation Modal */}
        <ConfirmationModal
          isOpen={isEditConfirmOpen}
          onClose={() => setIsEditConfirmOpen(false)}
          onConfirm={confirmEdit}
          title="Confirm Update"
          message="Are you sure you want to update this schedule?"
          confirmText="Update"
          cancelText="Cancel"
        />
      </Modals>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this schedule for ${
          getEmployeeName(scheduleToDelete?.employee_assigned, employees) ||
          "None"
        } on ${scheduleToDelete?.days || "these days"}?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}