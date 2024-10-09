import React from 'react'
import { Navigation } from '..'
import { Outlet } from 'react-router-dom'

const ProtuctedRoute = () => {
  return (
    <div className='flex'>
      <div className='flex-[2] ring-1 ring-slate-200 min-h-screen'>
        <Navigation />
      </div>
      <div className=' flex-[10]'>
        <Outlet />
      </div>
    </div>
  )
}

export default ProtuctedRoute