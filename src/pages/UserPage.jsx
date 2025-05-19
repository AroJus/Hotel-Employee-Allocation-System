import React from 'react'
import Layout from '../components/Layout'
import UserManagement from '../components/UserManagement'
import useUser from '../hook/useUser';

export default function UserPage() {

const{

    users,
    loading,
    username, setUsername,
    password, setPassword,
    last_name, setLastname,
    first_name, setFirstname,
    userlevel, setUserlevel,
    userstatus, setUserstatus,
    email, setEmail,
    addUser,
    isAddModalsOpen, setIsAddModalsOpen,
    isEditModalsOpen, setIsEditModalsOpen,
    deleteUser,
    editUser,
    isEditingUser

} = useUser()

  return (
      <Layout>
          {loading ? "Loading. . ." : <UserManagement 
          users={users} 
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          last_name={last_name}
          setLastname={setLastname}
          first_name={first_name}
          setFirstname={setFirstname}
          userlevel={userlevel}
          setUserlevel={setUserlevel}
          userstatus={userstatus}
          setUserstatus={setUserstatus}
          email={email}
          setEmail={setEmail}
          addUser={addUser}
          isAddModalsOpen={isAddModalsOpen}
          setIsAddModalsOpen={setIsAddModalsOpen}
          isEditModalsOpen={isEditModalsOpen}
          setIsEditModalsOpen={setIsEditModalsOpen}
          deleteUser={deleteUser}
          editUser={editUser}
          isEditingUser={isEditingUser}
          />}
      </Layout>
    )
}
