import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URL } from "../api/api_url";

export default function useTask() {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [taskname, setTaskname] = useState("");
    const [e_assigned, setE_assigned] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [isAddModalsOpen, setIsAddModalsOpen] = useState(false);
    const [isEditModalsOpen, setIsEditModalsOpen] = useState(false);

    // Fetch tasks and employees
    
  const fetchData = async () => {
      setLoading(true);
      try {
        const [taskRes, employeeRes] = await Promise.all([
          axios.get(`${API_URL}task/`),
          axios.get(`${API_URL}employee/`)
        ]);
          setTasks(taskRes.data);
          setEmployees(employeeRes.data);
      } catch (error) {
          console.error("Error fetching data:", error);
      } finally {
          setLoading(false);
      }
  };
        
  useEffect(() => {
    fetchData();
  }, []);

    // Add task
    const addTask = async () => {
        try {
            const payload = {
                taskname,
                employee_assigned: e_assigned || null // Send null if no employee selected
            };
            const res = await axios.post(`${API_URL}task/create/`, payload);
            setTasks([...tasks, res.data]);
            setTaskname("");
            setE_assigned("");
            setIsAddModalsOpen(false);
        } catch (e) {
            console.error("Error adding task:", e);
        }
    };

    // Edit task
    const editTask = (task) => {
        setIsEditModalsOpen(true);
        setSelectedTaskId(task.id);
        setTaskname(task.taskname);
        if (typeof task.employee_assigned === "object" && task.employee_assigned !== null) {
          setE_assigned(task.employee_assigned.id?.toString() || "");
        } else if (task.employee_assigned) {
          setE_assigned(task.employee_assigned.toString());
        } else {
          setE_assigned("");
        }
    };

    // Update task
    const updateTask = async () => {
        try {
            const payload = {
                taskname,
                employee_assigned: e_assigned || null // Send null if no employee selected
            };
            const res = await axios.put(`${API_URL}task/update/${selectedTaskId}/`, payload);
            setTasks(
                tasks.map((task) =>
                    task.id === selectedTaskId ? res.data : task
                )
            );
            setTaskname("");
            setE_assigned("");
            setSelectedTaskId(null);
            setIsEditModalsOpen(false);
        } catch (e) {
            console.error("Edit failed:", e);
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_URL}task/delete/${id}/`);
            setTasks(tasks.filter((task) => task.id !== id));
        } catch (e) {
            console.error("Error deleting task:", e);
        }
    };

    return {
        tasks,
        employees,
        loading,
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
        deleteTask
    };
}