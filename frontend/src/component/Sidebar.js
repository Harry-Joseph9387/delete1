import React from 'react'
import close from '../pics/close.png'
import{Routes} from 'react-router-dom'
import {useState} from 'react'
const Sidebar = () => {
  const [sidebarOpen,setSidebarOpen]=useState(1)
  const toggleSidebar=()=>{
    setSidebarOpen(sidebarOpen*-1)
    const sidebar=document.querySelector('.sidebar')
    if(sidebarOpen===-1){
      sidebar.style.width=0;
    }
    else{
      sidebar.style.width=20+"%";
    }
    
  }
  return (
    <div className="sidebar">
      
      {sidebarOpen===-1?<img src={close} className='close' onClick={()=>{toggleSidebar()}} alt="" />:<img src={close} onClick={()=>{toggleSidebar()}} className='open' alt="" />}
      <div className="links">
        <a href="/login">login</a>
        <a href="/signup">signup</a>
      </div>
    </div>
  )
}

export default Sidebar