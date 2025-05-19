import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URL } from "../api/api_url";

export default function useEmployee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [empname, setEmpname] = useState("");
  const [jobposition, setJobposition] = useState("");

  const [isAddModalsOpen, setIsAddModalsOpen] = useState(false);
  const [isEditModalsOpen, setIsEditModalsOpen] = useState(false);

  // Fetch employees
  useEffect(() => {
    const getEmployee = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}employee/`);
        setEmployees(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError(error.response?.data?.message || "Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };
    getEmployee();
  }, []);

  // Add employee
  const addEmployee = async () => {
    try {
      const res = await axios.post(`${API_URL}employee/create/`, { empname, jobposition });
      setEmployees([...employees, res.data]);
      setEmpname("");
      setJobposition("");
      setIsAddModalsOpen(false);
      setError(null);
    } catch (e) {
      console.error("Error adding employee:", e);
      setError(e.response?.data?.message || "Failed to add employee");
      throw e; // Allow caller to handle error
    }
  };

const editEmployee = async (id) => {
  try {
    const res = await axios.put(`${API_URL}employee/update/${id}/`, { 
      empname, 
      jobposition 
    });

    setEmployees(employees.map(employee => 
      employee.id === id ? res.data : employee
    ));

    setEmpname("");
    setJobposition("");
    setIsEditModalsOpen(false);
    setError(null);
    return res.data;
  } catch (e) {
    console.error("Error updating employee:", e);
    const errorMsg = e.response?.data?.message || 
                   e.response?.data?.detail || 
                   "Failed to update employee";
    setError(errorMsg);
    throw errorMsg;
  }
};

  // Delete employee
  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_URL}employee/delete/${id}/`);
      setEmployees(employees.filter((employee) => employee.id !== id));
      setError(null);
    } catch (e) {
      console.error("Error deleting employee:", e);
      setError(e.response?.data?.message || "Failed to delete employee");
      throw e; // Allow caller to handle error
    }
  };

  return {
    employees,
    loading,
    error,
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
  };
}