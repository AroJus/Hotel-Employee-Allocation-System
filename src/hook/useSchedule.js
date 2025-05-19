import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { API_URL } from "../api/api_url";

export default function useSchedule() {
    const [schedules, setSchedules] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [es_assigned, setEs_assigned] = useState("");
    const [time, setTime] = useState("");
    const [days, setDays] = useState("");
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [isAddModalsOpen, setIsAddModalsOpen] = useState(false);
    const [isEditModalsOpen, setIsEditModalsOpen] = useState(false);

    const pollingRef = useRef(null);

    // Fetch schedules and employees
    const fetchData = async () => {
        setLoading(true);
        try {
            const [scheduleRes, employeeRes] = await Promise.all([
                axios.get(`${API_URL}schedule/`),
                axios.get(`${API_URL}employee/`)
            ]);
            setSchedules(scheduleRes.data);
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

    // Add schedule
    const addSchedule = async () => {
        try {
            const payload = {
                employee_assigned: es_assigned || null, // Send null if no employee selected
                time,
                days
            };
            const res = await axios.post(`${API_URL}schedule/create/`, payload);
            setSchedules([...schedules, res.data]);
            setEs_assigned("");
            setTime("");
            setDays("");
            setIsAddModalsOpen(false);
        } catch (e) {
            console.error("Error adding schedule:", e);
        }
    };

    // Edit schedule
    const editSchedule = (schedule) => {
        setIsEditModalsOpen(true);
        setSelectedScheduleId(schedule.id);

        if (typeof schedule.employee_assigned === "object" && schedule.employee_assigned !== null) {
          setEs_assigned(schedule.employee_assigned.id?.toString() || "");
        } else if (schedule.employee_assigned) {
          setEs_assigned(schedule.employee_assigned.toString());
        } else {
          setEs_assigned("");
        }
        
        setTime(schedule.time);
        setDays(schedule.days);
    };

    // Update schedule
    const updateSchedule = async () => {
        try {
            const payload = {
                employee_assigned: es_assigned || null, // Send null if no employee selected
                time,
                days
            };
            const res = await axios.put(`${API_URL}schedule/update/${selectedScheduleId}/`, payload);
            setSchedules(
                schedules.map((schedule) =>
                    schedule.id === selectedScheduleId ? res.data : schedule
                )
            );
            setEs_assigned("");
            setTime("");
            setDays("");
            setSelectedScheduleId(null);
            setIsEditModalsOpen(false);
        } catch (e) {
            console.error("Edit failed:", e);
        }
    };

    // Delete schedule
    const deleteSchedule = async (id) => {
        try {
            await axios.delete(`${API_URL}schedule/delete/${id}/`);
            setSchedules(schedules.filter((schedule) => schedule.id !== id));
        } catch (e) {
            console.error("Error deleting schedule:");
        }
    };

    return {
        schedules,
        employees,
        loading,
        es_assigned,
        setEs_assigned,
        time,
        setTime,
        days,
        setDays,
        isAddModalsOpen,
        setIsAddModalsOpen,
        isEditModalsOpen,
        setIsEditModalsOpen,
        addSchedule,
        editSchedule,
        updateSchedule,
        deleteSchedule
    };
}