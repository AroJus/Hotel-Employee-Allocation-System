import React from 'react'
import Layout from '../components/Layout'
import EmployeeManagement from '../components/EmployeeManagement'
import useEmployee from '../hook/useEmployee';

export default function EmployeePage() {

  const{
  
    employees,
    loading,
    empname, setEmpname,
    jobposition, setJobposition,
    isAddModalsOpen, setIsAddModalsOpen,
    isEditModalsOpen, setIsEditModalsOpen,
    addEmployee,
    editEmployee,
    deleteEmployee

  
  } = useEmployee()

  return (
      <Layout>
        {loading ? "Loading. . ." : <EmployeeManagement
                  employees={employees}
                  empname={empname}
                  setEmpname={setEmpname}
                  jobposition={jobposition}
                  setJobposition={setJobposition}
                  isAddModalsOpen={isAddModalsOpen}
                  setIsAddModalsOpen={setIsAddModalsOpen}
                  isEditModalsOpen={isEditModalsOpen}
                  setIsEditModalsOpen={setIsEditModalsOpen}
                  editEmployee={editEmployee}
                  addEmployee={addEmployee}
                  deleteEmployee={deleteEmployee}
                  />}
      </Layout>
    )
}