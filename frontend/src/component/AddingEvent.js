import React from 'react'
import './Components.css'
import close from '../pics/close.png'
import styles from './AddingEvent.module.css';
import {useState,useEffect} from 'react'
const AddingEvent = ({fetchEvents,setEventName,fetchAdminData,isAdmin,mainUser,setToggleCreateEvent,fetchOrganizedEvents,triggerUpdateEvent,toggleCreateEvent,addevent,setTriggerUpdateEvent,isUpdate,eventname,eventName}) => {
  const [oldDetails,setOldDetails]=useState(undefined)
  const [oldEventName,setOldEventName]=useState()
  const [executionStopper,setExecutionStopper]=useState(false)
  const fetchEvent=async (x)=>{
    try{
    const response=await fetch(`${process.env.REACT_APP_BASE_URL}/userevents`,{
      method:"GET",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    const data=await response.json()
    const newEventNameInputed=document.querySelector(".eventname")
    const y=eventName?eventName:{"title":newEventNameInputed.value,"organizer":oldDetails.organizer,"registeredusers":oldDetails.registeredusers,likedusers:oldDetails.likedusers}
    const event=data.allevents.filter(x=>x.title===y.title)
    // console.log("from addingevent.js,eventName:",y,data.allevents)
    setOldEventName(event[0].title)
    setOldDetails(event[0])
  }
  catch(err){
    console.log(err)
  }
  }

  const funct=async()=>{
    console.log(isAdmin)
    
    
    const status=await addevent(isUpdate,oldEventName,isAdmin,mainUser)
    // const status='true'
    if(isAdmin){
      fetchAdminData()
    }
    else{
      fetchOrganizedEvents()
    }
  
    if(status==='true'){
      const newEventNameInputed=document.querySelector(".eventname")
      const x={"title":newEventNameInputed.value,"organizer":oldDetails.organizer,"registeredusers":oldDetails.registeredusers,likedusers:oldDetails.likedusers}
      if(isUpdate){
        setEventName((prevValue)=>({"title":newEventNameInputed.value,"organizer":oldDetails.organizer,"registeredusers":oldDetails.registeredusers,likedusers:oldDetails.likedusers}))
        if(!isAdmin){
          fetchEvent(x)
          fetchEvents()//for home page
          console.log(status==='true',status,"isUpdate",isUpdate)
          setTriggerUpdateEvent(triggerUpdateEvent*-1)// purpose of this is to reset the oldEventName, if not present , error of not showing existence of oldEventName
        }
      }    
      else{
        setToggleCreateEvent(toggleCreateEvent*-1)
      }
    }
  }
  
  useEffect(()=>{
    if(isUpdate){
      fetchEvent()
    }
  },[isUpdate])

  // useEffect(()=>{
  //   console.log("oldDetails",oldDetails)
  // },[oldDetails])
  return (
    <div className="createEventBody">
          <img src={close} className='close' onClick={()=>{
            if(isUpdate){
              setTriggerUpdateEvent(triggerUpdateEvent*-1)// purpose of this is to reset the oldEventName, if not present , error of not showing existence of oldEventName
            }
            else{
              setToggleCreateEvent(toggleCreateEvent*-1)
            }
            }} alt="" />
          <div className={styles.container}>
            <div className={styles.box}>
                <label>Event Name</label>
                <input value={oldDetails?oldDetails.title:""} onChange={(e)=>{setOldDetails({...oldDetails,title:e.target.value})}} className='eventname' type="text"></input>

                <label>Event Date</label>
                <input value={oldDetails?oldDetails.time:""} onChange={(e)=>{setOldDetails({...oldDetails,time:e.target.value})}} className='time' type="string"></input>

                <label>Image URL</label>
                <input value={oldDetails?oldDetails.image:""} onChange={(e)=>{setOldDetails({...oldDetails,image:e.target.value})}} className='image' type="text"></input>

                <label>Event Location</label>
                <input value={oldDetails?oldDetails.location:""}  onChange={(e)=>{setOldDetails({...oldDetails,location:e.target.value})}}className='location'></input>

                <label>Event Description</label>
                <textarea value={oldDetails?oldDetails.about:""}  onChange={(e)=>{setOldDetails({...oldDetails,about:e.target.value})}} className={`${styles.about} about`}></textarea>

                <button className={styles.bp} onClick={()=>{funct();setExecutionStopper(true)
                  }} type="submit">{isUpdate?`Update Event`:"Create Event"}</button>
            </div>
        </div>
        </div>
  )
}

export default AddingEvent