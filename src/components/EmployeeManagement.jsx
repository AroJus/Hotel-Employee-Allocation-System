import React, { useState } from "react";
import Modals from "./Modals";
import ConfirmationModal from "./ConfirmationModal";
import { User, Briefcase, AlertCircle, Edit2, Trash } from "lucide-react";
import { toast } from "react-toastify";

export default function EmployeeManagement({
  employees,
  empname,
  setEmpname,
  jobposition,
  setJobposition,
  isAddModalsOpen,
  setIsAddModalsOpen,
  isEditModalsOpen,
  setIsEditModalsOpen,
  addEmployee,
  editEmployee,
  deleteEmployee,
  error,
}) {
  const [addErrors, setAddErrors] = useState({ empname: "", jobposition: "" });
  const [editErrors, setEditErrors] = useState({
    empname: "",
    jobposition: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Confirmation modals
  const [isAddConfirmOpen, setIsAddConfirmOpen] = useState(false);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);

  const openAddModals = () => setIsAddModalsOpen(true);
  const closeAddModals = () => {
    setIsAddModalsOpen(false);
    setEmpname("");
    setJobposition("");
    setAddErrors({ empname: "", jobposition: "" });
  };

  const openEditModals = (employee) => {
    setSelectedEmployee(employee);
    setEmpname(employee.empname);
    setJobposition(employee.jobposition);
    setIsEditModalsOpen(true);
  };

  const closeEditModals = () => {
    setIsEditModalsOpen(false);
    setEmpname("");
    setJobposition("");
    setEditErrors({ empname: "", jobposition: "" });
    setSelectedEmployee(null);
  };

  const validateForm = (isEdit = false) => {
    let isValid = true;
    const newErrors = { empname: "", jobposition: "" };

    if (!empname.trim()) {
      newErrors.empname = "Employee name is required";
      isValid = false;
    }
    if (!jobposition.trim()) {
      newErrors.jobposition = "Job position is required";
      isValid = false;
    }

    if (isEdit) {
      setEditErrors(newErrors);
    } else {
      setAddErrors(newErrors);
    }
    return isValid;
  };

  // Add Employee with confirmation
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsAddConfirmOpen(true);
    }
  };

  const confirmAdd = async () => {
    try {
      await addEmployee();
      toast.success("Employee added successfully!");
      closeAddModals();
    } catch (err) {
      toast.error(error || "Failed to add employee");
    }
    setIsAddConfirmOpen(false);
  };

  // Edit Employee with confirmation
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (validateForm(true) && selectedEmployee) {
      setIsEditConfirmOpen(true);
    }
  };

  const confirmEdit = async () => {
    try {
      await editEmployee(selectedEmployee.id);
      toast.success("Employee updated successfully!");
      closeEditModals();
    } catch (err) {
      toast.error(err?.toString() || error || "Failed to update employee");
    }
    setIsEditConfirmOpen(false);
  };

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployee(employeeToDelete.id);
        toast.success("Employee deleted successfully!", {
          position: "top-right",
        });
      } catch (err) {
        toast.error(error || "Failed to delete employee", {
          position: "top-right",
        });
      }
    }
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-1 border-gray-300 pb-3 mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left mb-4 sm:mb-0">
          Employee Manager
        </h1>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto"
          onClick={openAddModals}
        >
          + Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-xs sm:text-sm text-center text-gray-800">
          <thead className="text-xs uppercase bg-gray-100 text-gray-700">
            <tr>
              <th className="px-2 sm:px-4 py-3 border-b border-gray-200">Id</th>
              <th className="px-2 sm:px-4 py-3 border-b border-gray-200">
                Name
              </th>
              <th className="px-2 sm:px-4 py-3 border-b border-gray-200">
                Job Position
              </th>
              <th className="px-2 sm:px-4 py-3 border-b border-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-2 sm:px-4 py-4">{employee.id}</td>
                <td className="px-2 sm:px-4 py-4">{employee.empname}</td>
                <td className="px-2 sm:px-4 py-4">{employee.jobposition}</td>
                <td className="flex justify-center items-center space-x-2 mt-2">
                  <button
                    className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto"
                    onClick={() => openEditModals(employee)}
                  >
                    <Edit2 className="h-4 w-4"/>
                    Edit
                  </button>

                  <button
                    className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all w-full sm:w-auto"
                    onClick={() => handleDelete(employee)}
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

      {/* Add Employee Modal */}
      <Modals isOpen={isAddModalsOpen} onClose={closeAddModals}>
        <form
          onSubmit={handleAddSubmit}
          className="p-6 sm:p-8 flex flex-col space-y-6 w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center flex items-center justify-center gap-2">
            <User className="w-6 h-6 text-green-600" />
            Add New Employee
          </h2>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="empname"
              className="font-medium text-gray-700 flex items-center gap-2"
            >
              <User className="w-5 h-5 text-gray-500" />
              Employee Name
            </label>
            <input
              type="text"
              id="empname"
              className={`border ${
                addErrors.empname ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
              value={empname}
              onChange={(e) => setEmpname(e.target.value)}
              placeholder="Enter employee name"
              aria-invalid={addErrors.empname ? "true" : "false"}
              aria-describedby={addErrors.empname ? "empname-error" : undefined}
            />
            {addErrors.empname && (
              <p
                id="empname-error"
                className="text-red-500 text-sm flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {addErrors.empname}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="jobposition"
              className="font-medium text-gray-700 flex items-center gap-2"
            >
              <Briefcase className="w-5 h-5 text-gray-500" />
              Job Position
            </label>
            <input
              type="text"
              id="jobposition"
              className={`border ${
                addErrors.jobposition ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
              value={jobposition}
              onChange={(e) => setJobposition(e.target.value)}
              placeholder="Enter job position"
              aria-invalid={addErrors.jobposition ? "true" : "false"}
              aria-describedby={
                addErrors.jobposition ? "jobposition-error" : undefined
              }
            />
            {addErrors.jobposition && (
              <p
                id="jobposition-error"
                className="text-red-500 text-sm flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {addErrors.jobposition}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              Add Employee
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
          message="Are you sure you want to add this employee?"
          confirmText="Add"
          cancelText="Cancel"
        />
      </Modals>

      {/* Edit Employee Modal */}
      <Modals isOpen={isEditModalsOpen} onClose={closeEditModals}>
        <form
          onSubmit={handleEditSubmit}
          className="p-6 sm:p-8 flex flex-col space-y-6 w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center flex items-center justify-center gap-2">
            <User className="w-6 h-6 text-green-600" />
            Edit Employee
          </h2>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="edit-empname"
              className="font-medium text-gray-700 flex items-center gap-2"
            >
              <User className="w-5 h-5 text-gray-500" />
              Employee Name
            </label>
            <input
              type="text"
              id="edit-empname"
              className={`border ${
                editErrors.empname ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
              value={empname}
              onChange={(e) => setEmpname(e.target.value)}
              placeholder="Enter employee name"
              aria-invalid={editErrors.empname ? "true" : "false"}
              aria-describedby={
                editErrors.empname ? "edit-empname-error" : undefined
              }
            />
            {editErrors.empname && (
              <p
                id="edit-empname-error"
                className="text-red-500 text-sm flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {editErrors.empname}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="edit-jobposition"
              className="font-medium text-gray-700 flex items-center gap-2"
            >
              <Briefcase className="w-5 h-5 text-gray-500" />
              Job Position
            </label>
            <input
              type="text"
              id="edit-jobposition"
              className={`border ${
                editErrors.jobposition ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
              value={jobposition}
              onChange={(e) => setJobposition(e.target.value)}
              placeholder="Enter job position"
              aria-invalid={editErrors.jobposition ? "true" : "false"}
              aria-describedby={
                editErrors.jobposition ? "edit-jobposition-error" : undefined
              }
            />
            {editErrors.jobposition && (
              <p
                id="edit-jobposition-error"
                className="text-red-500 text-sm flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {editErrors.jobposition}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              Update Employee
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
          message={`Are you sure you want to update ${
            selectedEmployee?.empname || "this employee"
          }?`}
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
        message={`Are you sure you want to delete ${
          employeeToDelete?.empname || "this employee"
        }?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}