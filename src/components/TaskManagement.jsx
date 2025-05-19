import React, { useState } from "react";
import Modals from "./Modals";
import ConfirmationModal from "./ConfirmationModal";
import { CheckSquare, AlertCircle, Edit2, Trash } from "lucide-react";
import { toast } from "react-toastify";

export default function TaskManagement({
  tasks,
  employees,
  taskname,
  setTaskname,
  e_assigned,
  setE_assigned,
  isAddModalsOpen,
  setIsAddModalsOpen,
  isEditModalsOpen,
  setIsEditModalsOpen,
  addTask,
  editTask,
  updateTask,
  deleteTask,
}) {
  const [addErrors, setAddErrors] = useState({ taskname: "" });
  const [editErrors, setEditErrors] = useState({ taskname: "" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Confirmation modals
  const [isAddConfirmOpen, setIsAddConfirmOpen] = useState(false);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);

  const openAddModals = () => setIsAddModalsOpen(true);
  const closeAddModals = () => {
    setIsAddModalsOpen(false);
    setTaskname("");
    setE_assigned("");
    setAddErrors({ taskname: "" });
  };

  const openEditModals = (task) => {
    editTask(task);
  };

  const closeEditModals = () => {
    setIsEditModalsOpen(false);
    setTaskname("");
    setE_assigned("");
    setEditErrors({ taskname: "" });
  };

  const validateForm = (isEdit = false) => {
    let isValid = true;
    const newErrors = { taskname: "" };

    if (!taskname.trim()) {
      newErrors.taskname = "Task name is required";
      isValid = false;
    }

    if (isEdit) {
      setEditErrors(newErrors);
    } else {
      setAddErrors(newErrors);
    }
    return isValid;
  };

  // Add Task with confirmation
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsAddConfirmOpen(true);
    }
  };

  const confirmAdd = async () => {
    try {
      await addTask();
      toast.success("Task added successfully!");
      closeAddModals();
    } catch (err) {
      toast.error("Failed to add task");
    }
    setIsAddConfirmOpen(false);
  };

  // Edit Task with confirmation
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(true)) {
      setIsEditConfirmOpen(true);
    }
  };

  const confirmEdit = async () => {
    try {
      await updateTask();
      toast.success("Task updated successfully!");
      closeEditModals();
    } catch (err) {
      toast.error("Failed to update task");
    }
    setIsEditConfirmOpen(false);
  };

  const handleDelete = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete.id);
        toast.success("Task deleted successfully!", {
          position: "top-right",
        });
      } catch (err) {
        toast.error("Failed to delete task", {
          position: "top-right",
        });
      }
    }
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  // Function to get employee name from ID or object
  const getEmployeeName = (employeeAssigned) => {
    if (!employeeAssigned) return "None";
    if (typeof employeeAssigned === "object" && employeeAssigned.empname) {
      return `${employeeAssigned.empname} (${employeeAssigned.jobposition || "N/A"})`;
    }
    const employee = employees.find(emp => emp.id === employeeAssigned);
    return employee ? `${employee.empname} (${employee.jobposition || "N/A"})` : "None";
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-1 border-gray-300 pb-3 mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left mb-4 sm:mb-0">
          Task Manager
        </h1>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto"
          onClick={openAddModals}
        >
          + Add Task
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table-fixed w-full max-w-full text-xs sm:text-sm text-center text-gray-800">
          <thead className="text-xs uppercase bg-gray-100 text-gray-700">
            <tr>
              <th className="w-1/6 px-2 sm:px-4 py-3 border-b border-gray-200">Id</th>
              <th className="w-1/3 px-2 sm:px-4 py-3 border-b border-gray-200">Task Name</th>
              <th className="w-1/3 px-2 sm:px-4 py-3 border-b border-gray-200">Employee</th>
              <th className="w-1/6 px-2 sm:px-4 py-3  border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-2 sm:px-4 py-4">{task.id}</td>
                <td className="px-2 sm:px-4 py-4">{task.taskname}</td>
                <td className="px-2 sm:px-4 py-4">{getEmployeeName(task.employee_assigned)}</td>
                <td className="flex justify-center items-center space-x-2 mt-2">
                  <button
                    className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto"
                    onClick={() => openEditModals(task)}
                  >
                    <Edit2 className="h-4 w-4"/>
                    Edit
                  </button>
                  
                  <button
                    className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all w-full sm:w-auto"
                    onClick={() => handleDelete(task)}
                  >
                    <Trash className="h-4 w-4"/>
                    Delete
                  </button>
                </td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Task Modal */}
      <Modals isOpen={isAddModalsOpen} onClose={closeAddModals}>
        <form
          onSubmit={handleAddSubmit}
          className="p-6 sm:p-8 flex flex-col space-y-6 w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center flex items-center justify-center gap-2">
            <CheckSquare className="w-6 h-6 text-green-600" />
            Add New Task
          </h2>
          <div className="flex flex-col space-y-2">
            <label htmlFor="taskname" className="font-medium text-gray-700 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-gray-500" />
              Task Name
            </label>
            <input
              type="text"
              id="taskname"
              className={`border ${
                addErrors.taskname ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
              value={taskname}
              onChange={(e) => setTaskname(e.target.value)}
              placeholder="Enter task name"
              aria-invalid={addErrors.taskname ? "true" : "false"}
              aria-describedby={addErrors.taskname ? "taskname-error" : undefined}
            />
            {addErrors.taskname && (
              <p id="taskname-error" className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {addErrors.taskname}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="e_assigned" className="font-medium text-gray-700 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-gray-500" />
              Employee Assigned
            </label>
            <select
              id="e_assigned"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={e_assigned}
              onChange={(e) => setE_assigned(e.target.value)}
            >
              <option value="">None</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.empname} ({employee.jobposition || "N/A"})
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <CheckSquare className="w-5 h-5" />
              Add Task
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
          message="Are you sure you want to add this task?"
          confirmText="Add"
          cancelText="Cancel"
        />
      </Modals>

      {/* Edit Task Modal */}
      <Modals isOpen={isEditModalsOpen} onClose={closeEditModals}>
        <form
          onSubmit={handleEditSubmit}
          className="p-6 sm:p-8 flex flex-col space-y-6 w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center flex items-center justify-center gap-2">
            <CheckSquare className="w-6 h-6 text-green-600" />
            Edit Task
          </h2>
          <div className="flex flex-col space-y-2">
            <label htmlFor="edit-taskname" className="font-medium text-gray-700 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-gray-500" />
              Task Name
            </label>
            <input
              type="text"
              id="edit-taskname"
              className={`border ${
                editErrors.taskname ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
              value={taskname}
              onChange={(e) => setTaskname(e.target.value)}
              placeholder="Enter task name"
              aria-invalid={editErrors.taskname ? "true" : "false"}
              aria-describedby={editErrors.taskname ? "edit-taskname-error" : undefined}
            />
            {editErrors.taskname && (
              <p id="edit-taskname-error" className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {editErrors.taskname}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="edit-e_assigned" className="font-medium text-gray-700 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-gray-500" />
              Employee Assigned
            </label>
            <select
              id="edit-e_assigned"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={e_assigned}
              onChange={(e) => setE_assigned(e.target.value)}
            >
              <option value="">None</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.empname} ({employee.jobposition || "N/A"})
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <CheckSquare className="w-5 h-5" />
              Update Task
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
          message="Are you sure you want to update this task?"
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
        message={`Are you sure you want to delete the task "${taskToDelete?.taskname || "this task"}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}