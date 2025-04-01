import { useEffect, useState } from 'react';
import React from 'react';
import './Event.css';
import backgroundIMage from '../pics/images.jpg';
import { useNavigate } from 'react-router-dom';
import close from "../pics/close.png";
import { useLocation } from 'react-router-dom';

const Event = ({ loggedIn, usr, allevent,fetchEvents }) => {

  const [tempEventsInfo,setTempEventsInfo]=useState()

  const location = useLocation();
  
  const getQueryParam = (param) => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(param);
  };
  
  
  const eventname = getQueryParam('eventname');
  const username=localStorage.getItem('username')
  let temporaryUsr=usr;
  const navigate = useNavigate();



  let currentEvent=allevent.find(x=>x.title.replace(/\s+/g,'')===eventname)


  const [commenting, setCommenting] = useState(false);
  const [comments,setComments]=useState() 

  
  const addLikedRegistered=async()=>{
    const eventname=currentEvent.title
    const response=await fetch(`${process.env.REACT_APP_BASE_URL}/addlikedregistered`,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({temporaryUsr,tempEventsInfo}),
      credentials: 'include'
    })
    const data=await response.json()
    // alert(data,"addlikedregistered is executed")
  }



  useEffect(()=>{
    if(currentEvent){
      setComments(currentEvent.comments)
    }
  },[currentEvent])

  //live update of button's name
  useEffect(()=>{
    if(usr&&temporaryUsr&&currentEvent){
      console.log( "from evetns.js,error while logging out",temporaryUsr,temporaryUsr.likedevents)
      const isLiked = temporaryUsr.likedevents.includes(currentEvent.title);
      const isRegistered = temporaryUsr.registeredevents.includes(currentEvent.title);
      if(isLiked){
        const likedButton=document.querySelector('.like')
        likedButton.innerHTML='Liked'
      }
      else{
        const likedButton=document.querySelector('.like')
        likedButton.innerHTML='Like'
      }
      if(isRegistered){
        const registeredButton=document.querySelector('.register')
        registeredButton.innerHTML='Registered'
      }
      else{
        const registeredButton=document.querySelector('.register')
        registeredButton.innerHTML='Register'
      }
    }
  },[usr,currentEvent,temporaryUsr])

  const sendComment=async(comment)=>{
    const  currentEventTitle=currentEvent.title
    const response=await fetch(`${process.env.REACT_APP_BASE_URL}/addcomment`,{
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({comment,currentEventTitle}),
      credentials: 'include'
    })
    const data=await response.json()
    
    fetchEvents()
  }
  

  const addComment = () => {
    if (!loggedIn) {
      navigate('/login');
    } else {
      const commentInput = document.querySelector('.comment-input input');
      const comment={ username:username, dp:usr.image, comments: commentInput.value }
      sendComment(comment);
      comment.value = '';
      
    }
  };
  
  const liking = () => {
    if (loggedIn) {
      const isLiked = temporaryUsr.likedevents.includes(currentEvent.title);
      if (isLiked) {

        const likedButton=document.querySelector('.like')
        likedButton.innerHTML='Like'
        temporaryUsr.likedevents=temporaryUsr.likedevents.filter(x=>x!==currentEvent.title)
        tempEventsInfo.likedusers=tempEventsInfo.likedusers.filter(x=>x!==username)
        addLikedRegistered()
        
      } else {

        const likedButton=document.querySelector('.like')
        likedButton.innerHTML='Liked'
        temporaryUsr.likedevents=[...temporaryUsr.likedevents,currentEvent.title]
        tempEventsInfo.likedusers=[...tempEventsInfo.likedusers,username]
        addLikedRegistered()
      }
      console.log(temporaryUsr,temporaryUsr.likedevents.includes(currentEvent.title))
    } else {
      navigate('/login');
    }
  };

  const registering = () => {
    if (loggedIn) {
      const isRegistered = temporaryUsr.registeredevents.includes(currentEvent.title);
      if (isRegistered) {
        const registeredButton=document.querySelector('.register')
        registeredButton.innerHTML='Register'
        temporaryUsr.registeredevents=temporaryUsr.registeredevents.filter(x=>x!=currentEvent.title)
        tempEventsInfo.registeredusers=tempEventsInfo.registeredusers.filter(x=>x!==username)

        addLikedRegistered()
      } else {
        const registeredButton=document.querySelector('.register')
        registeredButton.innerHTML='Registered'
        temporaryUsr.registeredevents=[...temporaryUsr.registeredevents,currentEvent.title]
        tempEventsInfo.registeredusers=[...tempEventsInfo.registeredusers,username]

        addLikedRegistered()
      }
      console.log(temporaryUsr,temporaryUsr.registeredevents.includes(currentEvent.title))
    } else {
      navigate('/login');
    }
  };

  
  const fetchEventsInfo=async ()=>{
    const eventname=currentEvent.title
    const response=await fetch(`${process.env.REACT_APP_BASE_URL}/eventsinfo`,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({eventname,tempEventsInfo}),
      credentials: 'include'
    })
    const data=await response.json()
    setTempEventsInfo(data);
  }

  useEffect(()=>{
    if(currentEvent){
      fetchEventsInfo()
    }
  },[currentEvent])

  useEffect(()=>{
    if(tempEventsInfo){
      console.log('tempEventsInfo',tempEventsInfo)
    }
  },[tempEventsInfo])

  return (
    <div className="event-main-no-use-div">
      {currentEvent &&
      <div className="event-main">
        {/* <button className='' onClick={addLikedRegistered}>alskfnas</button> */}
        <img src={currentEvent.image} className="eventBackgroundImg" alt="" />
        <div className="event-content">
          {/* <h2>{currentEvent.title}</h2>
          <h4>
            Organized by: <span>{currentEvent.organizer}</span>
          </h4>
          <h4>
            BIO: <span>{currentEvent.about}</span>
          </h4>
          <h4>Location: {currentEvent.location}</h4>
          <h4>Time: {currentEvent.time}</h4> */}
          <div className="event-card">
            <h2 className="event-title">{currentEvent.title} <span className='byline'>organized by:{currentEvent.organizer}</span> </h2>
           <div className="event-info">
               <p>
            {/* <span className="event-label">📅 Date:</span> {currentEvent.date} */}
               </p>
               <p>
                  <span className="event-label">⏰ Time:</span> {currentEvent.time}
               </p>
                <p>
                  <span className="event-label">📍 Location:</span> {currentEvent.location}
                </p>
                <p>
                  <span className="event-label">📝 Description:</span> {currentEvent.about}
                </p>
             </div>
           </div>
          <div className="interaction">
            <button onClick={() => setCommenting(true)}>Comment</button>
            <button className="like" onClick={()=>{liking()}}>
              Like
            </button>
            <button className="register" onClick={()=>{registering()}}>
              Register
            </button>
          </div>
        </div>

        {commenting && (
          <div className="commentBox-background">
            <div className="commentBox">
              <h2 style={{ fontSize: 30 + 'px' }}>COMMENTS</h2>
              <div className="content">
                {comments.map((x, index) => (
                  <div className="comment" key={index}>
                    <img src={x.dp} className="userDp" alt="" />
                    <div className="comment-display">
                      <h4 className='comment-username'>{x.username}</h4>
                      <p className='usercomment'>{x.comments}</p>

                    </div>
                  </div>
                ))}
              </div>
              <div className="comment-input">
                <input type="text" />
                <button onClick={addComment}>Submit</button>
              </div>
            </div>
            <img
              src={close}
              className="close"
              onClick={() => setCommenting(false)}
              alt=""
            />
          </div>
        )}
      </div>
}
    </div>
  );
};

export default Event;
