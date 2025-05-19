import React from 'react';
import Layout from '../components/Layout';
import TaskManagement from '../components/TaskManagement';
import useTask from '../hook/useTask';

export default function TaskPage() {
  const {
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
    deleteTask,
  } = useTask();

  return (
    <Layout>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-800 text-lg">Loading...</p>
        </div>
      ) : (
        <TaskManagement
          tasks={tasks}
          employees={employees}
          taskname={taskname}
          setTaskname={setTaskname}
          e_assigned={e_assigned}
          setE_assigned={setE_assigned}
          isAddModalsOpen={isAddModalsOpen}
          setIsAddModalsOpen={setIsAddModalsOpen}
          isEditModalsOpen={isEditModalsOpen}
          setIsEditModalsOpen={setIsEditModalsOpen}
          addTask={addTask}
          editTask={editTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      )}
    </Layout>
  );
}