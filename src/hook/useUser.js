import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URL } from "../api/api_url";

export default function useUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [last_name, setLastname] = useState("");
  const [first_name, setFirstname] = useState("");
  const [userlevel, setUserlevel] = useState("admin");
  const [userstatus, setUserstatus] = useState("Active");
  const [email, setEmail] = useState("");
  const [isAddModalsOpen, setIsAddModalsOpen] = useState(false);
  const [isEditModalsOpen, setIsEditModalsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch users
  const getUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}user/`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on mount
  useEffect(() => {
    getUsers();
  }, []);

  // Add user
  const addUser = async () => {
    try {
      await axios.post(`${API_URL}user/create/`, {
        username,
        password,
        last_name,
        first_name,
        userlevel,
        userstatus: userstatus === "Active",
        email,
      });
      await getUsers(); // Refetch users
    } catch (e) {
      throw new Error(e.response?.data?.message || "Failed to add user");
    }
  };

  // Open edit modal
  const openEditUserModal = (user) => {
    setSelectedUserId(user.id);
    setUsername(user.username);
    setPassword("");
    setLastname(user.last_name);
    setFirstname(user.first_name);
    setUserlevel(user.userlevel || "admin");
    setUserstatus(user.userstatus ? "Active" : "Inactive");
    setEmail(user.email);
    setIsEditModalsOpen(true);
  };

  // Edit user
  const editUser = async (id) => {
    setEditLoading(true);
    try {
      const payload = {
        username,
        last_name,
        first_name,
        userlevel,
        userstatus: userstatus === "Active",
        email,
      };
      if (password.trim()) {
        payload.password = password;
      }
      await axios.put(`${API_URL}user/update/${id}/`, payload);
      await getUsers();
    } catch (e) {
      console.error("Error updating user:", e.response?.data || e.message);
      throw new Error(e.response?.data?.message || "Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}user/delete/${id}/`);
      await getUsers(); 
    } catch (e) {
      throw new Error(e.response?.data?.message || "Failed to delete user");
    }
  };

  return {
    users,
    loading,
    editLoading,
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
    openEditUserModal,
  };
}