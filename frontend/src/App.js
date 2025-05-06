import React, { useEffect } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Navbar from './component/Navbar'
import Sidebar from './component/Sidebar'
import Event from './pages/Event'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Home from './pages/Home'
import {useState} from 'react'
import usrdp from './pics/x.jpg'
import Admin from './pages/Admin'
import './index.css'
import {useNavigate, useLocation} from 'react-router-dom'

const App = () => {

  const [username,setUsername]=useState()
  const [loggedIn,setLoggedIn]=useState()
  const [isAdmin,setIsAdmin]=useState()
  const [usr,setUsr]=useState()
  const [event,setEvent]=useState([])
  const usrname=localStorage.getItem("username")
  const navigate=useNavigate()  
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // [
  //   {
  //     organiser:"Organizer",about:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea, similique, maiores eligendi voluptatem libero obcaecati in nemo dignissimos autem quia, animi incidunt molestiae nulla aliquam excepturi aspernatur ad nobis nihil. Dolorem obcaecati velit voluptatem suscipit veritatis rerum fuga? Deleniti iusto similique hic cum distinctio magnam quo. Mollitia, eos. Nam sunt explicabo molestiae voluptate sapiente ad impedit sed ipsam eius architecto?",
  //     title:"EventNAme",location:"asf,sd",time:"12pm",img:"",
  //     comments:[
  //       {username:"user1",comments:"safsakjnksjfs"},
  //       {username:"user2",comments:"asdlnaskldf"},
  //       {username:"user3",comments:"asfklas"},
  //       {username:"user4",comments:"asfkaslmfsa"},
  //       {username:"user5",comments:"aslfnaskfs"},
  //       {username:"user6",comments:"asfkjsnskfjas"},
  //       {username:"user7",comments:"aslfnaskfas"},
  //       {username:"user8",comments:"asflkaslfkasmf"},
  //       {username:"user9s",comments:"saflsakmfs"},
        
  //     ]}
  //     ,{organiser:"",about:"Make your dream wedding a reality with our expert event management services! From stunning decor and seamless coordination to personalized touches, we ensure your special day is unforgettable. Book now to create cherished memories that last a lifetime!",title:"Wedding Event",location:"",time:"",image:"../pics/wed.jpg",comments:[]}
  //     ,{organiser:"",about:"Host professional corporate events with ease! We provide seamless organization, cutting-edge technology, and bespoke services to make your conferences, seminars, or meetings a resounding success. Let's elevate your next event!",title:"Corporate Event",location:"",time:"",image:"../pics/conf.jpeg",comments:[]}
  //     ,{organiser:"",about:"Rock your event with live band performances! Whether it's a concert, music festival, or a private gathering, we bring electrifying energy and unforgettable entertainment to your stage. Book the best bands now!",title:"Band Event",location:"",time:"",image:"../pics/wed/band.jpg",comments:[]}
  //     ,{organiser:"",about:"Throw the ultimate party with our event management expertise! From vibrant themes and decor to exciting activities and music, we ensure your celebration is a hit. Let's make your party unforgettable!",title:"Party Event",location:"",time:"",image:"../pics/wed/party.jpg",comments:[]}
  // ])

  //on reloading, user logs out as the loggedin goes null
  //saving loggedIn,isAdmin,username  on local storage
  //setting all in home as on jumping from login to home, useEffect gets executed without user actually reloading the site
 
  //moving from one to other acc, profile pic still shows of previous accc

  //isAdmin value is not boolean, it is a "false", a string  
  // useEffect(()=>{
  //   console.log('usr update prompt is out')
  // },[usr]) //this is for live updating liked/registerd events to usr when moved out from events page

  const fetchUsr=async()=>{
    const username_useractivity=usrname;
    const response=await fetch(`${process.env.REACT_APP_BASE_URL}/useractivity`,{
      method:"POST",
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify({username_useractivity}),
      credentials: 'include'
    })
    const data=await response.json()
      setUsr(data)//doing this as moving to other pages,fetchusr is initiated
      
  }

  
  useEffect(()=>{
    const admin=localStorage.getItem('admin')
    if(usrname && admin==="false"){
      fetchUsr();
    }
  },[usrname,isAdmin])

  // alert("mainUser to be passed for sending email respective to one who updated it")
  //2nd update of event not possible unless reloading the page
  const addevent=async(isUpdate,oldEventName,isAdmin,mainUser)=>{
    if(loggedIn){
      const eventname=document.querySelector('.eventname');
      const location=document.querySelector('.location');
      const about=document.querySelector('.about');
      const time=document.querySelector('.time');
      const image=document.querySelector('.image')
      const newEvent={organizer:isAdmin?"admin":username,
        about:about.value,title:eventname.value,location:location.value,time:time.value,image:image.value,comments:[]}
      console.log("newEvent.organizer",newEvent.organizer,"isUpdate:",isUpdate)
      if(isUpdate){
        const response1=await fetch(`${process.env.REACT_APP_BASE_URL}/updateevent`,{
          method:"POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({newEvent,oldEventName,mainUser}),
          credentials: 'include'
        })
        const data2=await response1.json()
        console.log(data2)
        alert(Object.values(data2))
        if(response1.ok){
          return "true"
        }
        else{
          return "false"
        }


      }
      else{

        const response=await fetch(`${process.env.REACT_APP_BASE_URL}/checkevent`,{
          method:"POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({newEvent}),
          credentials: 'include'
        })
      
      const data1=await response.json()
    
        if(response.ok){
          const response1=await fetch(`${process.env.REACT_APP_BASE_URL}/addevent`,{
              method:"POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newEvent),
              credentials: 'include'
            })
            const data2=await response1.json()
            console.log(data2)
        fetchEvents();

        return "true";
  
  
        }
        else{
            alert("already exist")
            return "false"
          }

      }

      
        
      }
    else{
      navigate('/login')
    }
    }
  // alert("addevent and updateevent clash in adminjs updating sections ")

  //declaring fetchEvents outside for to call again after event creation
  const fetchEvents=async()=>{      
    const response=await fetch(`${process.env.REACT_APP_BASE_URL}/userevents`,{
      method:"GET",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    const data=await response.json()
    setEvent(data.allevents)
  }
  useEffect(()=>{

  fetchEvents();
  
},[])

useEffect(()=>{
  console.log("isadmin",isAdmin,"loggedIn",loggedIn,"username",username)
},[isAdmin,loggedIn,username])
useEffect(()=>{
  const currentTime = new Date();
  const x1 = localStorage.getItem('username') ; 
  const x2= localStorage.getItem('admin') ;
  const x3= localStorage.getItem('loggedIn') ;

  setUsername(x1)
  setLoggedIn(x3)//usrfetch is updated on moving to other pages, maybe because usename is updated inifinite times due to  execution of setLoggedIn() and providing loggedIn in dependency array
  setIsAdmin(x2)
  
  // console.log(currentTime.toLocaleTimeString(),'usrname is updated')
},[loggedIn])

  
  return (
    <div className='main'>
        <div className="not-sidebar">
          <Navbar loggedIn={loggedIn} usr={usr} setUsr={setUsr}setLoggedIn={setLoggedIn} isAdmin={isAdmin}/>
          {!isHomePage && (
            <button className='homebutton' onClick={() => navigate('/')}>EMW</button>
          )}

          <div className="main-content">
            <Routes>
              {/* <Route path='/event' element={<Event loggedIn={loggedIn} usr={usr} setUsr={setUsr} fetchEvents={fetchEvents}  allevent={event}/>}/> */}
              {isAdmin!=='false' ?
              <Route path='/' element={<Admin addevent={addevent} loggedIn={loggedIn}/>}/>
              :
              <Route path='/' element={<Home setLoggedIn={setLoggedIn} isAdmin={isAdmin} setUsr={setUsr} event={event} addevent={addevent} fetchEvents={fetchEvents} setEvent={setEvent} usr={usr} username={username}  loggedIn={loggedIn}/>}/>}
               
              <Route path='/login' element={<Login fetchUsr={fetchUsr}   setLoggedIn={setLoggedIn}/>}/>
              <Route path='/signup' element={<Signup/>}/>
              <Route path='/profile' element={<Profile fetchEvents={fetchEvents} usr={usr} setUsr={setUsr} addevent={addevent}/>}/>
            </Routes>
          </div>
        </div>
    </div>
  )
}

export default App