import React from 'react'
import close from "../pics/close.png"
import {useState,useEffect} from 'react'
import AddingEvent from '../component/AddingEvent'
const RegistrationStatus = ({fetchEvents,fetchAdminData,isAdmin,mainUser,organizedEvents,fetchOrganizedEvents,eventName,removeUser,setEventName,addevent}) => {
  const [triggerUpdateEvent,setTriggerUpdateEvent]=useState(-1)
  const [isUpdate,setIsUpdate]=useState(true)
  const [event,setEvent]=useState(
    organizedEvents.find(event => event.title=== eventName.title)
  )
  useEffect(()=>{
      setEvent(organizedEvents.find(event => event.title=== eventName.title))
  },[eventName,isAdmin,organizedEvents])


//   useEffect(()=>{
//     setEvent(organizedEvents.find(event => event.title=== eventName.title))
// },[eventName,organizedEvents])

   
 
   useEffect(()=>{
    if(isAdmin){
      fetchAdminData()
    }
   },[eventName,isAdmin])


   useEffect(()=>{
    if(!isAdmin){
      console.log("initiated fetchOrganizedEvents at registrations")
      fetchOrganizedEvents()
    }
   },[eventName,isAdmin])

  //here the eventName is not literally the event's name, it is the object containing all event details of a specific event
  return (
    <div className='event-status-container'>
        <img className='close' onClick={()=>{setEventName('')}}  src={close} alt="" />
          <div className="event-status-box">
            <h2>Registered User</h2>
            {event&&
            <div className="event-status-inbox">
              {event.registeredusers.map(user=> {
                return <div className="event-status-user">
                  <span>{user}</span>
                  {/* <span>{event.title}</span> */}
                  <button
                    className="remove-button"
                    onClick={() => removeUser(user,event.title)}
                  >
                  Remove
                  </button>
                      </div>
              })}
            </div>
            }
            <div className="registration-status-update">
              <h4>Change event details?</h4>
              <button className='update-button' onClick={()=>{setTriggerUpdateEvent(triggerUpdateEvent*-1)}}>Update</button>
            </div>
          </div>
          {triggerUpdateEvent===1 &&
            <AddingEvent fetchEvents={fetchEvents} eventName={eventName} setEventName={setEventName} fetchAdminData={fetchAdminData} isAdmin={isAdmin} mainUser={mainUser} addevent={addevent} fetchOrganizedEvents={fetchOrganizedEvents} triggerUpdateEvent={triggerUpdateEvent} setTriggerUpdateEvent={setTriggerUpdateEvent} isUpdate={isUpdate} />
          }

    </div>
  )
}

export default RegistrationStatus