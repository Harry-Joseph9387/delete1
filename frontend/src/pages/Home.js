import React, { useEffect } from 'react';
import './Home.css';
import {useState} from "react"
// Importing images
import eventImage from '../pics/event.jpg';
import x from '../pics/back.jpg'
import close from '../pics/close.png'
import AddingEvent from '../component/AddingEvent';
import {useNavigate} from 'react-router-dom'

const Home = ({event,usr,setEvent,loggedIn,fetchEvents,username,addevent}) => {
  const [toggleCreateEvent,setToggleCreateEvent]=useState(-1)
 

    
    

  return (
    <div className="home-main">
      <div style={{ position: 'relative', textAlign: 'center' }}>
        username:admin,password:admin <br/>
        username:user1,password:user1
        <img 
          src={eventImage} 
          style={{
            width: '100%', 
            height: '100vh', 
            objectFit: 'cover', 
            display: 'block', 
            margin: '0'
          }} 
        />
        
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgb(255, 255, 255)', padding: '20px', borderRadius: '10px', width: '50%', background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3))'
        }}>
          <h1 style={{ fontSize: '36px' }}>
            Welcome to Our Event Management System
          </h1>
          <p style={{ fontSize: '30px', margin: '10px 0' }}>
            Seamlessly organize and participate in events with ease!
          </p>
          <p style={{ fontSize: '30px', margin: '10px 0' }}>
            Whether you’re planning an event or looking to join one, our system is your go-to solution. Start exploring today!
          </p>
        </div>
      </div>

      <div className="event">
        {event.map((x)=>{
          return <div className="resize">
            <img src={x.image}/>
            <div className="text">
              <h4>{x.title}</h4>
              <p>{x.about}</p>
              <a href={`/event?eventname=${x.title.replace(/\s+/g,'')}`}>Know More</a>
            </div>
          </div>
        })}
      </div>
      <div className="x">
        <p>Planning to host a event?</p>
        <button className='host' onClick={()=>{setToggleCreateEvent(toggleCreateEvent*-1)}}>Host</button>
      </div>
      {toggleCreateEvent===1&&
        <AddingEvent fetchOrganizedEvents={fetchEvents} isAdmin={false} setToggleCreateEvent={setToggleCreateEvent} isUpdate={false} addevent={addevent} toggleCreateEvent={toggleCreateEvent}/>
      }
    </div>
  );
};

export default Home;
