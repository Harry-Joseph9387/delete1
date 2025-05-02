import React, { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
// Importing images
import eventImage from '../pics/event.jpg';
import x from '../pics/back.jpg'
import close from '../pics/close.png'
import bgEffect from '../pics/bgEffect.png'
import logo from '../pics/logo.jpg'
import AddingEvent from '../component/AddingEvent';
import Event from './Event';

const Home = ({event,usr,setEvent,loggedIn,fetchEvents,username,addevent,setUsr}) => {
  const [toggleCreateEvent,setToggleCreateEvent]=useState(-1)
  const [toggleEvent,setToggleEvent]=useState(-1);
  const [eventSelected,setEventSelected]=useState()
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  
  // Define fixed scattered positions based on screen sizes
  const getResponsivePositions = () => {
    // Base positions for large screens (default)
    const largeScreenPositions = [
      { left: '15%', top: '20%' },     // Top left section
      { left: '75%', top: '25%' },     // Top right section
      { left: '42%', top: '15%' },     // Top center
      { left: '30%', top: '45%' },     // Middle left
      { left: '62%', top: '55%' },     // Middle right
      { left: '22%', top: '75%' },     // Bottom left
      { left: '55%', top: '35%' },     // Center
      { left: '80%', top: '65%' },     // Bottom right
      { left: '68%', top: '85%' },     // Far bottom right
      { left: '35%', top: '85%' },     // Far bottom
      { left: '88%', top: '40%' },     // Far right
      { left: '10%', top: '65%' },     // Lower left
      { left: '48%', top: '75%' },     // Lower center
    ];
    
    // Medium screen positions (tablet)
    const mediumScreenPositions = [
      { left: '15%', top: '15%' },     // Adjusted for medium screens
      { left: '70%', top: '20%' },
      { left: '42%', top: '25%' },
      { left: '25%', top: '40%' },
      { left: '60%', top: '45%' },
      { left: '20%', top: '65%' },
      { left: '50%', top: '35%' },
      { left: '75%', top: '60%' },
      { left: '65%', top: '75%' },
      { left: '35%', top: '80%' },
      { left: '80%', top: '35%' },
      { left: '15%', top: '53%' },
      { left: '45%', top: '60%' },
    ];
    
    // Small screen positions (mobile)
    const smallScreenPositions = [
      { left: '25%', top: '8%' },      // Stacked vertically with more spacing
      { left: '75%', top: '8%' },
      { left: '25%', top: '23%' },
      { left: '75%', top: '23%' },
      { left: '25%', top: '38%' },
      { left: '75%', top: '38%' },
      { left: '25%', top: '53%' },
      { left: '75%', top: '53%' },
      { left: '25%', top: '68%' },
      { left: '75%', top: '68%' },
      { left: '25%', top: '83%' },
      { left: '75%', top: '83%' },
      { left: '50%', top: '95%' },
    ];
    
    // Determine current screen size
    const width = window.innerWidth;
    if (width <= 576) {
      return smallScreenPositions;
    } else if (width <= 992) {
      return mediumScreenPositions;
    } else {
      return largeScreenPositions;
    }
  };

  const [positions, setPositions] = useState(getResponsivePositions());

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setPositions(getResponsivePositions());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Limit displayed events to 13
  const displayedEvents = event.slice(0, 13);
  
  const handleCloseEvent = () => {
    setIsExiting(true);
    setTimeout(() => {
      setToggleEvent(-1);
      setIsExiting(false);
    }, 400); // Match this duration with the CSS transition duration
  };

  return (
    <div className="home-main">
      {/* <img src={bgEffect} className='bgEffect' alt="" /> */}
        <div className="company">
          <div className="company_logo_name">
            {/* <img src={logo} alt="" /> */}
            <h1>Event <br /> Management <br /> Company</h1>
          </div>
          <div className="intro-description">
            <p>Welcome to your ultimate event partner!</p>
            <p>Turning moments into memories.</p>
            <p>Plan less, celebrate more!</p>
            <p>Where every event becomes unforgettable.</p>
          </div>
        </div>
  
        <h1 className='intro-title-2'>Trending Events</h1>
      <div className="event">
        {displayedEvents.map((x, index) => {
          const position = positions[index];
          
          return (
            <div 
              className="resize" 
              // onClick={() => window.location.href = `/event?eventname=${x.title.replace(/\s+/g,'')}`}
              onClick={()=>{setEventSelected(x.title);setToggleEvent( toggleEvent*-1);}}
              style={{
                position: 'absolute',
                top: position.top,
                left: position.left
              }}
              key={index}
            >
              <div className="image-container">
                <img src={x.image} />
                <div className="overlay-content">
                  <h4 className="event-title">{x.title}</h4>
                  <div className="event-details">
                    <p>{x.about}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* <div className="x">
        <p>Planning to host a event?</p>
        <button className='host' onClick={()=>{setToggleCreateEvent(toggleCreateEvent*-1)}}>Host</button>
      </div> */}
      {toggleCreateEvent===1&&
        <AddingEvent fetchOrganizedEvents={fetchEvents} isAdmin={false} setToggleCreateEvent={setToggleCreateEvent} isUpdate={false} addevent={addevent} toggleCreateEvent={toggleCreateEvent}/>
      }
      {toggleEvent===1&&
      <div className={`eventSelectedBackground ${isExiting ? 'exit-animation' : ''}`}>
          <Event 
            setToggleEvent={handleCloseEvent} 
            eventSelected={eventSelected} 
            loggedIn={loggedIn} 
            usr={usr} 
            setUsr={setUsr} 
            fetchEvents={fetchEvents}  
            allevent={event}
          />
      </div>
      }
    
    </div>
  );
};

export default Home;
