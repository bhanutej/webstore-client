import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../../NavBar/NavBar'

export const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet/>
    </>
  )
}
