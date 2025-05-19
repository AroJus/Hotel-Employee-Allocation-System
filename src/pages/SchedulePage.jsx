import React from 'react';
import Layout from '../components/Layout';
import ScheduleManagement from '../components/ScheduleManagement';
import useSchedule from '../hook/useSchedule';

export default function SchedulePage() {
  const {
    employees,
    schedules,
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
    deleteSchedule,
  } = useSchedule();

  return (
    <Layout>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-800 text-lg">Loading...</p>
        </div>
      ) : (
        <ScheduleManagement
          schedules={schedules}
          employees={employees}
          es_assigned={es_assigned}
          setEs_assigned={setEs_assigned}
          time={time}
          setTime={setTime}
          days={days}
          setDays={setDays}
          isAddModalsOpen={isAddModalsOpen}
          setIsAddModalsOpen={setIsAddModalsOpen}
          isEditModalsOpen={isEditModalsOpen}
          setIsEditModalsOpen={setIsEditModalsOpen}
          addSchedule={addSchedule}
          editSchedule={editSchedule}
          updateSchedule={updateSchedule}
          deleteSchedule={deleteSchedule}
        />
      )}
    </Layout>
  );
}