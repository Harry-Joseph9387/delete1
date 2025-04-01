import React from 'react'
import './Components.css'
import logo from '../pics/logo.jpg'
import userdp from '../pics/x.jpg'
import { useNavigate } from 'react-router-dom'
const Navbar = ({loggedIn,setLoggedIn,usr,setUsr,isAdmin}) => {
  const navigate=useNavigate()
  
  return (
    <div className="navbar">
      <div className="" style={{display:"flex",alignItems:"center"}}>
        <img src={logo} onClick={()=>{navigate('/')}} alt="" />
        <h2>Event Management</h2>
      </div>
      <div className="links">
        {loggedIn && 
          <div className="navbar-profile">
            {isAdmin==='false' &&
              <img src={(usr&&usr.image)?usr.image:userdp} onClick={()=>{navigate('/profile')}} alt="" />      
            }  
              <button onClick={()=>{localStorage.setItem('loggedIn','');setLoggedIn(false);setUsr({});localStorage.setItem("username","")}}>logout</button>
          </div>
        }
        {!loggedIn &&
          <div className="navbar-links">
            <a href="/login">login</a>
            <a href="/signup">signup</a>
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar