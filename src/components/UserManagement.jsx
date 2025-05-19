import React, { useState } from "react";
import Modals from "./Modals";
import ConfirmationModal from "./ConfirmationModal";
import {
  User,
  Briefcase,
  AlertCircle,
  Mail,
  Lock,
  Edit2,
  Trash,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function UserManagement({
  users,
  username,
  setUsername,
  password,
  setPassword,
  last_name,
  setLastname,
  first_name,
  setFirstname,
  userlevel,
  setUserlevel,
  userstatus,
  setUserstatus,
  email,
  setEmail,
  addUser,
  isAddModalsOpen,
  setIsAddModalsOpen,
  isEditModalsOpen,
  setIsEditModalsOpen,
  deleteUser,
  editUser,
}) {
  const [addErrors, setAddErrors] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [editErrors, setEditErrors] = useState({
    username: "",
    password: "",
    email: "",
  });

  const { user: loggedInUser, setUser } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Confirmation modals
  const [isAddConfirmOpen, setIsAddConfirmOpen] = useState(false);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);

  const openAddModals = () => setIsAddModalsOpen(true);
  const closeAddModals = () => {
    setIsAddModalsOpen(false);
    setUsername("");
    setPassword("");
    setFirstname("");
    setLastname("");
    setEmail("");
    setUserstatus("");
    setAddErrors({ username: "", password: "", email: "" });
  };

  const openEditModals = (user) => {
    setSelectedUser(user);
    setUsername(user.username);
    setPassword("");
    setFirstname(user.first_name);
    setLastname(user.last_name);
    setUserlevel(user.userlevel);
    setUserstatus(user.userstatus ? "Active" : "Inactive");
    setEmail(user.email);
    setIsEditModalsOpen(true);
  };

  const closeEditModals = () => {
    setIsEditModalsOpen(false);
    setUsername("");
    setPassword("");
    setFirstname("");
    setLastname("");
    setEmail("");
    setUserstatus("");
    setEditErrors({ username: "", password: "", email: "" });
    setSelectedUser(null);
  };

  const validateForm = (isEdit = false) => {
    let isValid = true;
    const newErrors = { username: "", password: "", email: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }
    if (!isEdit && !password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (isEdit) {
      setEditErrors(newErrors);
    } else {
      setAddErrors(newErrors);
    }
    return isValid;
  };

  // Add User with confirmation
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsAddConfirmOpen(true);
    }
  };

  const confirmAdd = async () => {
    try {
      await addUser();
      toast.success("User added successfully!");
      closeAddModals();
    } catch (err) {
      toast.error(err.message || "Failed to add user");
    }
    setIsAddConfirmOpen(false);
  };

  // Edit User with confirmation
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (validateForm(true) && selectedUser) {
      setIsEditConfirmOpen(true);
    }
  };

  const confirmEdit = async () => {
    try {
      await editUser(selectedUser.id);
      toast.success("User updated successfully!");
      if (loggedInUser && selectedUser.id === loggedInUser.id) {
        setUser({
          ...loggedInUser,
          username,
          first_name,
          last_name,
          email,
          userstatus: userstatus === "Active",
          userlevel,
        });
      }
      closeEditModals();
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    }
    setIsEditConfirmOpen(false);
  };

  const handleDelete = (user) => {
    if (loggedInUser && user.id === loggedInUser.id) {
      toast.error("You cannot delete your own account while logged in.");
      return;
    }
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        toast.success("User deleted successfully!", { position: "top-right" });
      } catch (err) {
        toast.error(err.message || "Failed to delete user");
      }
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-1 border-gray-300 pb-3 mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left mb-4 sm:mb-0">
          User Manager
        </h1>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto"
          onClick={openAddModals}
        >
          + Add User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-xs sm:text-sm text-center text-gray-800">
          <thead className="text-xs uppercase bg-gray-100 text-gray-700">
            <tr>
              <th className="px-2 sm:px-4 py-3 border-b border-gray-200">Id</th>
              <th className="px-2 sm:px-4 py-3 border-b border-gray-200">
                User Name
              </th>
              <th className="px-2 sm:px-4 py-3 border-b border-gray-200">
                Full Name
              </th>
              <th className="px-2 sm:px-4 py-3 border-b border-gray-200">
                User Level
              </th>
              <th className="px-2 sm:px-4 py-3 border-b border-gray-200">
                User Status
              </th>
              <th className="px-2 sm:px-4 py-3 border-b border-gray-200">
                Email
              </th>
              <th className="px-2 sm:px-4 py-3 border-b border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-2 sm:px-4 py-4">{user.id}</td>
                <td className="px-2 sm:px-4 py-4">{user.username}</td>
                <td className="px-2 sm:px-4 py-4">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-2 sm:px-4 py-4">{user.userlevel}</td>
                <td className="px-2 sm:px-4 py-4">
                  {user.userstatus ? "Active" : "Inactive"}
                </td>
                <td className="px-2 sm:px-4 py-4">{user.email}</td>
                <td className="flex justify-center items-center space-x-2 mt-2">
                  <button
                    className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto"
                    onClick={() => openEditModals(user)}
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    disabled={loggedInUser && user.id === loggedInUser.id}
                    className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all w-full sm:w-auto disabled:opacity-50"
                    onClick={() => handleDelete(user)}
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <Modals isOpen={isAddModalsOpen} onClose={closeAddModals}>
        <form
          onSubmit={handleAddSubmit}
          className="p-6 sm:p-8 w-screen max-w-lg mx-auto bg-white rounded-xl shadow-lg flex flex-col"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center flex items-center justify-center gap-2 mb-6">
            <User className="w-6 h-6 text-green-600" />
            Add New User
          </h2>
          <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-6">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="username"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <User className="w-5 h-5 text-gray-500" />
                Username
              </label>
              <input
                type="text"
                id="username"
                className={`border ${
                  addErrors.username ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                aria-invalid={addErrors.username ? "true" : "false"}
                aria-describedby={
                  addErrors.username ? "username-error" : undefined
                }
              />
              {addErrors.username && (
                <p
                  id="username-error"
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {addErrors.username}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="password"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <Lock className="w-5 h-5 text-gray-500" />
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`border ${
                  addErrors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                aria-invalid={addErrors.password ? "true" : "false"}
                aria-describedby={
                  addErrors.password ? "password-error" : undefined
                }
              />
              {addErrors.password && (
                <p
                  id="password-error"
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {addErrors.password}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="first_name"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <User className="w-5 h-5 text-gray-500" />
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={first_name}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Enter first name"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="last_name"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <User className="w-5 h-5 text-gray-500" />
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={last_name}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Enter last name"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="email"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <Mail className="w-5 h-5 text-gray-500" />
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`border ${
                  addErrors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                aria-invalid={addErrors.email ? "true" : "false"}
                aria-describedby={addErrors.email ? "email-error" : undefined}
              />
              {addErrors.email && (
                <p
                  id="email-error"
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {addErrors.email}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="userlevel"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5 text-gray-500" />
                User Level
              </label>
              <input
                type="text"
                id="userlevel"
                className="border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                value="admin"
                readOnly
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="userstatus"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5 text-gray-500" />
                User Status
              </label>
              <select
                id="userstatus"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2  transition-all"
                value={userstatus}
                onChange={(e) => setUserstatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              Add User
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
          message={`Are you sure you want to add this user?`}
          confirmText="Add"
          cancelText="Cancel"
        />
      </Modals>

      {/* Edit User Modal */}
      <Modals isOpen={isEditModalsOpen} onClose={closeEditModals}>
        <form
          onSubmit={handleEditSubmit}
          className="p-6 sm:p-8 w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg flex flex-col"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center flex items-center justify-center gap-2 mb-6">
            <User className="w-6 h-6 text-green-600" />
            Edit User
          </h2>
          <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-6">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="edit-username"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <User className="w-5 h-5 text-gray-500" />
                Username
              </label>
              <input
                type="text"
                id="edit-username"
                className={`border ${
                  editErrors.username ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                aria-invalid={editErrors.username ? "true" : "false"}
                aria-describedby={
                  editErrors.username ? "edit-username-error" : undefined
                }
              />
              {editErrors.username && (
                <p
                  id="edit-username-error"
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {editErrors.username}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="edit-password"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <Lock className="w-5 h-5 text-gray-500" />
                Password (leave blank to keep unchanged)
              </label>
              <input
                type="password"
                id="edit-password"
                className={`border ${
                  editErrors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                aria-invalid={editErrors.password ? "true" : "false"}
                aria-describedby={
                  editErrors.password ? "edit-password-error" : undefined
                }
              />
              {editErrors.password && (
                <p
                  id="edit-password-error"
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {editErrors.password}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="edit-first_name"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <User className="w-5 h-5 text-gray-500" />
                First Name
              </label>
              <input
                type="text"
                id="edit-first_name"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={first_name}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Enter first name"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="edit-last_name"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <User className="w-5 h-5 text-gray-500" />
                Last Name
              </label>
              <input
                type="text"
                id="edit-last_name"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={last_name}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Enter last name"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="edit-email"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <Mail className="w-5 h-5 text-gray-500" />
                Email
              </label>
              <input
                type="email"
                id="edit-email"
                className={`border ${
                  editErrors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                aria-invalid={editErrors.email ? "true" : "false"}
                aria-describedby={
                  editErrors.email ? "edit-email-error" : undefined
                }
              />
              {editErrors.email && (
                <p
                  id="edit-email-error"
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {editErrors.email}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="edit-userlevel"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5 text-gray-500" />
                User Level
              </label>
              <input
                type="text"
                id="edit-userlevel"
                className="border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                value={userlevel}
                readOnly
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="edit-userstatus"
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5 text-gray-500" />
                User Status
              </label>
              <select
                id="edit-userstatus"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2  transition-all"
                value={userstatus}
                onChange={(e) => setUserstatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              Update User
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
            selectedUser?.username || "this user"
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
          userToDelete?.username || "this user"
        }?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
