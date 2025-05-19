import React, { useState } from "react";
import useNotification from "../hook/useNotification";
import useEmployee from "../hook/useEmployee";
import ConfirmationModal from "./ConfirmationModal";
import { Send, Trash } from "lucide-react";

const LOAD_SIZE = 3;

export default function AdminNotification() {
  const { notifications, loading, deleteNotification, sendNotification } = useNotification();
  const { employees } = useEmployee();
  const [form, setForm] = useState({ employee: "", title: "", message: "" });
  const [showSuggestions, setShowSuggestions] = useState(false);

  // For confirmation modals
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [pendingSend, setPendingSend] = useState(null);

  // Validation state
  const [formErrors, setFormErrors] = useState({ employee: "", title: "", message: "" });

  // Load more state
  const [visibleCount, setVisibleCount] = useState(LOAD_SIZE);

  const filteredEmployees = form.employee
    ? employees.filter(emp =>
        emp.empname.toLowerCase().includes(form.employee.toLowerCase())
      )
    : [];

  const handleEmployeeChange = (e) => {
    setForm({ ...form, employee: e.target.value });
    setShowSuggestions(true);
  };

  const handleEmployeeSelect = (empname) => {
    setForm({ ...form, employee: empname });
    setShowSuggestions(false);
  };

  // Validation before sending
  const validateForm = () => {
    const errors = { employee: "", title: "", message: "" };
    let valid = true;
    if (!form.employee.trim()) {
      errors.employee = "Employee is required";
      valid = false;
    }
    if (!form.title.trim()) {
      errors.title = "Title is required";
      valid = false;
    }
    if (!form.message.trim()) {
      errors.message = "Message is required";
      valid = false;
    }
    setFormErrors(errors);
    return valid;
  };

  // Open send confirmation modal
  const handleSend = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setPendingSend({ ...form });
    setIsSendModalOpen(true);
  };

  // Confirm send
  const confirmSend = async () => {
    if (pendingSend) {
      await sendNotification(pendingSend);
      setForm({ employee: "", title: "", message: "" });
      setShowSuggestions(false);
      setPendingSend(null);
      setIsSendModalOpen(false);
      setFormErrors({ employee: "", title: "", message: "" });
      setVisibleCount(LOAD_SIZE); // Reset to first batch after sending
    }
  };

  const cancelSend = () => {
    setPendingSend(null);
    setIsSendModalOpen(false);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (deleteId) {
      await deleteNotification(deleteId);
      setDeleteId(null);
      setIsDeleteModalOpen(false);
      // If deleting last item in visible list, adjust visibleCount
      if (visibleCount > LOAD_SIZE && visibleCount > notifications.length - 1) {
        setVisibleCount((prev) => Math.max(LOAD_SIZE, prev - 1));
      }
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  // Load more notifications
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_SIZE, notifications.length));
  };

  const visibleNotifications = notifications.slice(0, visibleCount);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto h-full flex flex-col justify-start">
      <div className="border-b-1 border-gray-300 pb-3 mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
           Notifications
        </h1>
      </div>
      <form onSubmit={handleSend} className="mb-6 flex flex-col sm:flex-row gap-2 relative">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Employee name (or 'all')"
            value={form.employee}
            onChange={handleEmployeeChange}
            onFocus={() => setShowSuggestions(true)}
            autoComplete="off"
            className={`border rounded p-2 w-full ${formErrors.employee ? "border-red-500" : ""}`}
          />
          {formErrors.employee && (
            <p className="text-red-500 text-xs mt-1">{formErrors.employee}</p>
          )}
          {showSuggestions && filteredEmployees.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto shadow">
              {filteredEmployees.map((emp) => (
                <li
                  key={emp.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleEmployeeSelect(emp.empname)}
                >
                  {emp.empname}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={`border rounded p-2 w-full ${formErrors.title ? "border-red-500" : ""}`}
          />
          {formErrors.title && (
            <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`border rounded p-2 w-full ${formErrors.message ? "border-red-500" : ""}`}
          />
          {formErrors.message && (
            <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="flex justify-center items-center gap-1 bg-green-600 text-white px-4 py-2 rounded"
        >
          <Send className="w-4 h-4"/>
          Send
        </button>
      </form>
      <div className="flex-grow">
        {loading ? (
          <div className="text-gray-600 text-center flex-grow flex justify-center">
            <p className="text-sm sm:text-base">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-gray-600 text-center flex-grow flex justify-center">
            <p className="text-sm sm:text-base">
              No notifications available at the moment.
            </p>
          </div>
        ) : (
          <>
            <ul className="space-y-1">
              {visibleNotifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`p-4 rounded-lg shadow-md flex justify-between items-center ${
                    notif.read ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <div>
                    <div className="font-semibold">{notif.title}</div>
                    <div className="text-gray-700">{notif.message}</div>
                    <div className="text-xs text-gray-400">{notif.time}</div>
                    <div className="text-xs text-gray-500 italic">
                      For: {notif.employee}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(notif.id)}
                    className="flex justify-center items-center gap-1 px-3 py-2 rounded text-sm bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <Trash className="h-4 w-4"/>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            {/* Load More button */}
            {visibleCount < notifications.length && (
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
      {/* Confirmation for sending */}
      <ConfirmationModal
        isOpen={isSendModalOpen}
        onClose={cancelSend}
        onConfirm={confirmSend}
        title="Confirm Send"
        message={`Are you sure you want to send this notification to "${form.employee}"?`}
        confirmText="Send"
        cancelText="Cancel"
      />
      {/* Confirmation for deleting */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this notification?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}