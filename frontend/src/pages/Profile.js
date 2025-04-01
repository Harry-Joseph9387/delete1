import React from 'react'
import './Profile.css'
import {useState,useEffect} from 'react'
import userdp from '../pics/x.jpg'
import close from "../pics/close.png"
import RegistrationStatus from "../component/RegistrationStatus"

const Profile = ({usr,setUsr,addevent,fetchEvents}) => {
    const [userDetails,setUserDetails]=useState()
    const [organizedEvents,setOrganizedEvents]=useState()
    const [eventName,setEventName]=useState()
    const [mainUser,setMainUser]=useState(localStorage.getItem("username"))
      const handleEdit = () => {
        const newName = prompt("Enter new name:", userDetails.username);
        const newEmail = prompt("Enter new email:", userDetails.email);
        const newPhone = prompt("Enter new phone:", userDetails.contactNo);
        const newBio = prompt("Enter new bio:", userDetails.bio);
        const newLocation = prompt("Enter new location:", userDetails.location);
    
        setUserDetails({
          ...userDetails,
          username:newName|| userDetails.username,
          email: newEmail || userDetails.email,
          contactNo: newPhone || userDetails.contactNo,
          bio: newBio || userDetails.bio,
          location: newLocation || userDetails.location,
        });

      };
    
      const handleProfilePictureChange = () => {
        const newPicture = prompt("Enter new profile picture URL:",userDetails.image);
        setUserDetails({...userDetails,image: newPicture || userDetails.image});
        setUsr({...usr,"image":newPicture||userDetails.image})
      };
      const fetchUser=async()=>{
        const username_fetchuser=localStorage.getItem('username')
        // const username_fetchuser="harry1"
        const response=await fetch(`${process.env.REACT_APP_BASE_URL}/userinfo`,{
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({username_fetchuser}),
            credentials: 'include'
          })
          const data=await response.json()
          setUserDetails(data)
      }
      const updateUser=async()=>{
        const oldusername=localStorage.getItem('username')
        // const oldusername="x"

        
        const response=await fetch(`${process.env.REACT_APP_BASE_URL}/updateuserinfo`,{
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({userDetails,oldusername}),
            credentials: 'include'
          })
          const data=await response.json()
          if(response.ok){
            localStorage.setItem("username",userDetails.username) //on reloading, it sends new username to fetch the user
          }
          else{
            alert(Object.values(data))
          }
          
      }
      useEffect(()=>{
        fetchUser()
        fetchOrganizedEvents()
      },[])
      useEffect(()=>{
        if(userDetails){
            updateUser()
        }
      },[userDetails])

      const fetchOrganizedEvents=async()=>{
        const username=localStorage.getItem("username")
        const response=await fetch(`${process.env.REACT_APP_BASE_URL}/organizedevents`,{
          method:"POST",
          headers:{'Content-Type': 'application/json'},
          body:JSON.stringify({username}),
          credentials: 'include'
        })
        const data=await response.json()
        setOrganizedEvents(data)
      }
      

      useEffect(()=>{
        if(organizedEvents){
       
        }
      },[eventName,organizedEvents])
      const removeUser = async (user) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/removeregistereduser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              eventName: eventName.title,
              user: user,
            }),
          });
          if (response.ok) {
            const updatedEvents = [...organizedEvents];
            // const eventIndex = organizedEvents.indexOf(eventName);
            const eventIndex = organizedEvents.findIndex(event => event.title === eventName.title);

            updatedEvents[eventIndex].registeredusers = updatedEvents[
              eventIndex
            ].registeredusers.filter((u) => u !== user);
      
            setOrganizedEvents(updatedEvents);
          } else {
            alert(`Failed to remove ${user}.`);
          }
        } catch (error) {
          console.error("Error removing user:", error);
          alert("An error occurred. Please try again.");
        }
      };
     
  return (
    <div className="profile-main">
      {(userDetails&& usr)&&
      <div className="profile-container">
      <div className="profile-card">
        <img
          src={userDetails.image?userDetails.image:userdp}
          alt="Profile"
          className="profile-image"
          onClick={handleProfilePictureChange}
          title="Click to change profile picture"
        />
        <h2 className="profile-name">{userDetails.username}</h2>
        <p className="profile-email">{userDetails.email}</p>
        <p className="profile-phone">{userDetails.contactNo}</p>
        <p className="profile-location">Location:{userDetails.location}</p> 
        <p className="profile-bio">Bio:{userDetails.bio}</p>
        <button className="edit-profile-button" onClick={handleEdit}>
          Edit Profile
        </button>
        
      </div>
      
      <div className="profile-subheading-div">
        <h2>Events u organized</h2>
      </div>
    
      {organizedEvents&&
      <div className="profile-organized-events">        
          {organizedEvents.map(event=>{
            return <div className="profile-each-event">
              <img className='profile-each-event-image' src={event.image} alt="" />
              <p className='profile-each-event-title'>{event.title}</p>
              <div onClick={()=>{setEventName(event)}} className="overlay"></div>
              <button className="profile-each-event-delete">delete</button>
            </div>
          } )}
      </div>
      }
      {eventName  &&
          <RegistrationStatus fetchEvents={fetchEvents} mainUser={mainUser} isAdmin={false} addevent={addevent} fetchOrganizedEvents={fetchOrganizedEvents} organizedEvents={organizedEvents} eventName={eventName} removeUser={removeUser} setEventName={setEventName}/>
      }
    </div>
        
}
    </div>
  )
}

export default Profile