require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User=require('./models/User')
const Events=require('./models/Events')
const EventsInfo=require('./models/EventsInfo')
const jwt = require('jsonwebtoken');
const UserActivity=require('./models/UserActivity')
const nodemailer = require("nodemailer");
const app = express();
app.use(cors(
  {
  origin:[process.env.BASE_URL],
  allowedHeaders: ['Content-Type', 'Authorization'],  
  methods:["POST","GET","PUT","OPTIONS"],
  credentials:true
}
));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));


app.listen(3000, () => {
    console.log(`Server running on port 3000`);
  });

app.get("/",(req,res)=>{
  res.json("hello")
}) 
  
app.post('/login',async(req,res)=>{
    const { username, password} = req.body;
    console.log(username,password)
    const user=await User.findOne({username});
    console.log(user)
    if(!user || password!==user.password){
        console.log('Invalid credentials')
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret key is missing' });
  }
    const token = jwt.sign({username: user.username },process.env.JWT_SECRET,{ expiresIn: '1h' }
      );
    res.status(200).json({ token,admin:user.admin });
})

app.post('/signup', async (req, res) => {
    const { username, email, password,contactNo } = req.body;
    try {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        console.log("already exists")
        return res.status(400).json({ message: 'Username or Email already exist' });
      }
  
      const newUser = new User({ username, email, password,contactNo,admin:'false',bio:"",location:"",image:"" });
      const newUserActivity= new UserActivity({username,likedevents:[],registeredevents:[]})
      await newUserActivity.save();
      await newUser.save();
  
      res.status(201).json({message:"user created"}); // Send user details (without password)
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.post('/useractivity',async(req,res)=>{
  const {username_useractivity}=req.body;
  console.log(username_useractivity)
  let x = await UserActivity.findOne({username:username_useractivity});
  let y=await User.findOne({username:username_useractivity})
  let z={...x._doc,"image":y.image,"email":y.email,"contactNo":y.contactNo}
  
  if(!x){console.log("no useractivity");return res.status(404).json({message:"no useractivity"})}
  
  return res.status(200).json(z)
})

app.get('/userevents',async(req,res)=>{
  try{
    const allevents=await Events.find({}).lean()
    return res.status(200).json({allevents})
    }
  catch(err){
    console.log(err)
  }
})
app.post('/checkevent',async(req,res)=>{
  try{
    // const event=req.body
    const event=req.body.newEvent //doing this for updating event to work
    console.log(event)
    const isEventExist=await Events.findOne({title:event.title})
    if(isEventExist){
      return res.status(403).json({message:'event already exist'})
    }
    else{
      return res.status(201).json({message:"unique event"})
    }
}catch(err){
  console.log(err)
}})


app.post('/addevent',async(req,res)=>{
  try{
    const event=req.body
    const {organizer,about,title,location,time,image,comments}=event
    const addingEvent=new Events({organizer,about,title,location,time,comments,image})
    let organizer_user=await UserActivity.findOne({username:organizer})
    console.log(organizer)
    console.log(event)
    if(organizer_user.organizedevents){
      organizer_user.organizedevents=[...organizer_user.organizedevents,event.title]
    }
    else{
      organizer_user.organizedevents=[event.title]
    }
    await organizer_user.save()
    console.log("organized_User",organizer_user)

    const addingEventsInfo=new EventsInfo({eventname:title,likedusers:[],registeredusers:[]})
    await addingEventsInfo.save()
    await addingEvent.save()
    
    res.status(201).json({message:"event created"}); 
  }
  catch(err){
    console.log(err)
  }})
  
app.put('/addcomment',async(req,res)=>{
    try{
      const {comment,currentEventTitle}=req.body
      const event= await Events.findOne({title:currentEventTitle})

        event.comments=[...event.comments,comment]
        await event.save()
        return res.status(200).json({message:"comment added"})
      
    }
    catch(err){
      console.log(err)
    } 
  })


app.post('/addlikedregistered',async(req,res)=>{
  try{
    const {temporaryUsr,tempEventsInfo}=req.body
    const username=temporaryUsr.username
    const eventname=tempEventsInfo.eventname
    // console.log("temporaryusr",temporaryUsr,"tempEventsInfo",tempEventsInfo)
    const useractivity=await UserActivity.findOneAndReplace({username:username},temporaryUsr,{new:true})
    const eventsinfo=await EventsInfo.findOneAndReplace({eventname:eventname},tempEventsInfo,{new:true})
    if (!useractivity) {
      return res.status(404).json({ message: "no useractivity" });
    }
    if (!eventsinfo) {
      return res.status(404).json({ message: "no eventsINfo" });
    }
    res.status(200).json({message:'updatedUser'});  // Send the updated user as the response
  }
  catch(err){
    console.log(err)
  }
})

app.post('/eventsinfo',async(req,res)=>{
  const {eventname}=req.body;
  const evnt=await EventsInfo.find({eventname:eventname})
  const x=evnt[0]
  return res.status(200).json(x)
})

app.post('/userinfo',async(req,res)=>{
  const {username_fetchuser}=req.body
  const userFind=await User.find({username:username_fetchuser})
  const {username,password,email,contactNo,admin,bio,location,image}=userFind[0]
  res.status(200).json({username,email,contactNo,bio,location,image})
})

app.post('/updateuserinfo',async(req,res)=>{
  const {userDetails,oldusername}=req.body
  const newUsername=userDetails.username
  // const newUsername="harry1"
  

  //need to change event's organizer, user's comments and dp, (likedusers , registered users, on events info & userActivity) , 
  
  //updation of all username together works


  //username upadation on eventsinfo liked/registered users works
  const x=await User.find({username: newUsername})
  const y=await User.find({email:userDetails.email,  username: { $ne: oldusername }  })
  // console.log(x)
  // console.log(x.length,y.length,oldusername===newUsername,oldusername,newUsername)
  if((x.length===0||oldusername===newUsername) && y.length===0){
    const eventsinfo=await EventsInfo.find({})
  for (const eachEventInfo of eventsinfo){
    for (const eachLUser of eachEventInfo.likedusers){
      if(eachLUser===oldusername){
        eachEventInfo.likedusers=eachEventInfo.likedusers.map(eachUsername=>eachUsername===oldusername?newUsername:eachUsername)
      }
    }
    for (const eachRUser of eachEventInfo.registeredusers){
      if(eachRUser===oldusername){
        eachEventInfo.registeredusers=eachEventInfo.registeredusers.map(eachUsername=>eachUsername===oldusername?newUsername:eachUsername)
      }
    }
    await eachEventInfo.save()
  }

  //updation of username of useractivity works
  const useractivity=await UserActivity.findOne({username:oldusername})
  useractivity.username=newUsername
  await useractivity.save()


  //updation works for user's name in the comments
  await Events.updateMany(
    { "comments.username": oldusername }, // Find documents where comments array contains username = oldusername
    { $set: { "comments.$[elem].username": newUsername } }, // Update the username of matched array elements
    { arrayFilters: [{ "elem.username": oldusername }] } // Apply only to array elements with username = oldusername
  );

  await Events.updateMany(
    {"comments.username":oldusername},
    {$set:{"comments.$[elem].dp":userDetails.image}},
    {arrayFilters:[{"elem.username":oldusername}]}
  )
  
  //updation works for user's name in the organizer
  await Events.updateMany(
      {"organizer":oldusername},
      {$set:{"organizer":newUsername}}
    )
  
  
  await User.updateMany(
    {"username":oldusername},
    {$set:{
      "username":newUsername,
      "email":userDetails.email,
      "contactNo":userDetails.contactNo,
      "bio":userDetails.bio,
      "location":userDetails.location,
      "image":userDetails.image
    }}
  )
 
  
  
  
  return res.status(200).json({message:"xxxxx"})
  }

  else{
    return res.status(403).json({message:"such a username/email is already in use"})
  }
  
})

app.post('/organizedevents',async(req,res)=>{
  const {username}=req.body
  console.log(username)
  const useractivity=await UserActivity.findOne({username:username})
  let data=await Promise.all(
  useractivity.organizedevents.map(async eventtitle=>{
    const eachevent=await Events.findOne({title:eventtitle})
    const eacheventinfo=await EventsInfo.findOne({eventname:eventtitle})
    console.log(eacheventinfo)
    console.log(eventtitle)
    return{"title":eventtitle,
          "image":eachevent?eachevent.image:"",
          "registeredusers":eacheventinfo.registeredusers,
          "likedusers":eacheventinfo.likedusers}
  }))
  // console.log(data)
  return res.status(200).json(data)
})


app.post('/removeregistereduser',async(req,res)=>{
  const {eventName,user}=req.body
  console.log(eventName)
  const useractivity=await UserActivity.findOne({username:user})
  const eventsinfo=await EventsInfo.findOne({eventname:eventName})
  const event=await Events.findOne({title:eventName})
  const userDetails=await User.findOne({username:user})
  eventsinfo.registeredusers=eventsinfo.registeredusers.filter(x=>x!=user)
  useractivity.registeredevents=useractivity.registeredevents.filter(x=>x!=eventName)
  // console.log(eventsinfo,useractivity)
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });
  const mailOptions = {
    from: `"Event Management App":${process.env.EMAIL_USER}`, // sender address
    to: userDetails.email, // recipient's email
    subject: `You have been removed from the event: ${eventName}`,
    text: `Dear ${user},\n\nYou have been removed from the event: "${eventName}" by the organizer "${event.organizer}".\n\nIf you have any questions, please contact the event organizer.\n\nBest regards,\nEvent Management App Team`,
  };
  await transporter.sendMail(mailOptions);
  await eventsinfo.save()
  await useractivity.save()
  return res.status(200).json()
})

app.post('/validateEmail', async (req, res) => {
  const { email } = req.body;

  try {
      const userExists = await User.findOne({ email });
      if (userExists) {
          return res.json({ isAvailable: false }); // Email is already taken
      } else {
          return res.json({ isAvailable: true }); // Email is available
      }
  } catch (error) {
    res.status(500).json({error: 'Internal server error' });
  }})

  app.get('/admindata',async(req,res)=>{
    const users = await User.find();
    let userDetailsList = await Promise.all(
      users.map(async (user) => {
        if(user.username!=="admin"){
          const userActivity = await UserActivity.findOne({ username: user.username });
          // console.log(userActivity.username)
          return {
            username: user.username,
            email: user.email,
            registeredEvents: userActivity?.registeredevents || [],
            likedEvents: userActivity?.likedevents || [],
            organizedEvents: userActivity?.organizedevents || [],
          };
        }
        })
        
    );
    userDetailsList=userDetailsList.filter(x=>x!==undefined)
    const events = await Events.find();
    const eventDetailsList = await Promise.all(
      events.map(async (event) => {
        const eventInfo = await EventsInfo.findOne({ eventname: event.title });
        return {
          title: event.title,
          organizer: event.organizer,
          likedusers: eventInfo?.likedusers || [],
          registeredusers: eventInfo?.registeredusers || [],
        };
      })
    )
    
    return res.status(200).json({"events":eventDetailsList,"users":userDetailsList})
  })

  app.post('/delete-user', async (req, res) => {
    const { username } = req.body;
  
    try {
      const x=await User.find({username:username})
      console.log(x)
      const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
        },
      });
      const mailOptions = {
        from: `"Event Management App":${process.env.EMAIL_USER}`, // sender address
        to: x[0].email, // recipient's email
        subject: `Deletion of user ${username}`,
        text: `Dear ${username},\n\n Your account is Deleted by the Admin.\n\n Contact the Admin for more details .\n\nBest regards,\nEvent Management App Team`,
      };
      await transporter.sendMail(mailOptions);
      const userDeleted = await User.findOneAndDelete({ username });

      const userActivityDeleted = await UserActivity.findOneAndDelete({ username }); 

      const updatedEventsInfo = await EventsInfo.updateMany(
        {},
        {
          $pull: { likedusers: username, registeredusers: username },
        }
      );
  
      const eventsDeleted = await Events.deleteMany({ organizer: username });
  
      res.status(200).json({message: 'User and associated data deleted successfully',});
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });
  
  app.post('/delete-event', async (req, res) => {
    const {eventname} = req.body;
    const mainUser="admin"
    try {

      const x=await EventsInfo.findOne({eventname})
      const z=await Events.findOne({title:eventname})
      const z2=await User.findOne({username:z.organizer})
      const organizer={"organizer":z.organizer,"email":z2.email}
      const registeredUsersEmail=await Promise.all(x.registeredusers.map(async user=>{
          const y=await User.find({username:user})
          return {"username":y[0].username,"email":y[0].email}
      }))
      console.log('organizer',organizer)
      if(registeredUsersEmail.length!==0){
        registeredUsersEmail.map(async user=>{
          console.log("emai:",user.email,"username:",user.username,"eventname",eventname,"\n\n")
          const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
              user: process.env.EMAIL_USER, 
              pass: process.env.EMAIL_PASS, 
            },
          });
          const mailOptions = {
            from: `"Event Management App":${process.env.EMAIL_USER}`, // sender address
            to: user.email, 
            subject: `Deletion of Event ${eventname}`,
            text: `Dear ${user.username},\n\n The event: "${eventname}" by the organizer "${organizer.organizer}" is Deleted by the ${mainUser}.\n\n We appologises for the inconvinences.\n\nBest regards,\nEvent Management App Team`,
          };
          await transporter.sendMail(mailOptions);
          
      })
      }
      if(mainUser==="admin"){
        if(organizer.organizer!=="admin"){

          const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
              user: process.env.EMAIL_USER, 
              pass: process.env.EMAIL_PASS, 
            },
          });

          const mailOptions = {
            from: `"Event Management App":${process.env.EMAIL_USER}`, // sender address
            to: organizer.email, // recipient's email
            subject: `Deletion of Event ${eventname}`,
            text: `Dear ${organizer.organizer},\n\n The event: "${eventname}" by the organizer "${organizer.organizer}" is Deleted by the ${mainUser}.\n\n Contact the admin for more details.\n\nBest regards,\nEvent Management App Team`,
          };

          await transporter.sendMail(mailOptions);
      }
    }



      const event = await Events.findOneAndDelete({ title: eventname });

      
      const eventInfo = await EventsInfo.findOneAndDelete({ eventname });
  
      await UserActivity.updateMany(
        {},
        {
          $pull: {
            registeredevents: eventname,
            likedevents: eventname,
            organizedevents: eventname,
          },
        }
      );
      
      res.status(200).json({ message: 'Event deleted successfully'});
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  });

  app.post('/updateevent',async(req,res)=>{
    const {newEvent,oldEventName,mainUser}=req.body

    let canUpdate=false
    if(oldEventName===newEvent.title){
      canUpdate=true
    }
    else{
      const newEventCheck=await Events.find({title:newEvent.title})
      if(newEventCheck.length===0){
        canUpdate=true
      }
    }
    // console.log(mainUser,oldEventName)
    if(canUpdate){
      if(mainUser==="admin"){
         const fetchOrganizer=await Events.findOne({title:oldEventName})
         newEvent.organizer=fetchOrganizer.organizer
      }
      const oldEventComments=await Events.find({title:oldEventName})
      newEvent.comments=oldEventComments[0].comments
      // console.log(newEvent.comments,oldEventComments[0].comments,oldEventName)
      const eventReplaceStatus=await Events.findOneAndReplace(
      {title:oldEventName},
      newEvent,
      {new:true}
    )
    const eventInfoUpdate=await EventsInfo.findOne({eventname:oldEventName})
    eventInfoUpdate.eventname=newEvent.title
    await eventInfoUpdate.save()

    const userActivity=await UserActivity.find({})

    // console.log("before---------------------------------",userActivity)
    for(const user of userActivity){
      user.registeredevents=user.registeredevents.map(event=>{return event===oldEventName?newEvent.title:event})
      user.likedevents=user.likedevents.map(event=>{return event===oldEventName?newEvent.title:event})
      user.organizedevents=user.organizedevents.map(event=>{return event===oldEventName?newEvent.title:event})
      await user.save()
    }
    // console.log("after---------------------------------",userActivity)

    // console.log(userActivity)
    
  
    if(eventReplaceStatus){
      const eventname=newEvent.title
      const x=await EventsInfo.findOne({eventname})
      const z=await Events.findOne({title:eventname})
      const z2=await User.findOne({username:z.organizer})
      console.log("updatessssss",x,z,z2)
      const organizer={"organizer":z.organizer,"email":z2.email}
      const registeredUsersEmail=await Promise.all(x.registeredusers.map(async user=>{
          const y=await User.find({username:user})
          return {"username":y[0].username,"email":y[0].email}
      }))
      // console.log('organizer',organizer)
      if(registeredUsersEmail.length!==0){
        registeredUsersEmail.map(async user=>{
          // console.log("emai:",user.email,"username:",user.username,"eventname",eventname,"\n\n")
          const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
              user: process.env.EMAIL_USER, 
              pass: process.env.EMAIL_PASS, 
            },
          });
          const mailOptions = {
            from: `"Event Management App":${process.env.EMAIL_USER}`, // sender address
            to: user.email, 
            subject: `Updation of Event ${eventname}`,
            text: `Dear ${user.username},\n\n
            The event: "${oldEventName}" by the organizer "${organizer.organizer}"is updated by the ${mainUser}.\n\n 
            The Details:\n\n
            title:${newEvent.title!==oldEventName?newEvent.title:oldEventName}\n\n
            organizer:${newEvent.organizer}\n\n
            location:${newEvent.location}\n\n
            date:${newEvent.time}\n\n
            \n\nBest regards,\nEvent Management App Team`,
          };
          await transporter.sendMail(mailOptions);
          
      })}
      console.log(organizer)
      if(mainUser==="admin" && organizer.organizer!=="admin"){
        const transporter = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
          },
        });
        const mailOptions = {
          from: `"Event Management App":${process.env.EMAIL_USER}`, // sender address
          to: organizer.email, 
          subject: `Updation of Event ${eventname}`,
          text: `Dear ${organizer.username},\n\n
          The event: "${oldEventName}" by the organizer "${organizer.organizer}"
          is updated by the ${mainUser}.\n\n 
          The Details:\n\n
          \ttitle:${newEvent.title!==oldEventName?newEvent.title:oldEventName}\n\n
          \torganizer:${newEvent.organizer}\n\n
          \tlocation:${newEvent.location}\n\n
          \tdate:${newEvent.time}\n\n
          \n\nBest regards,\nEvent Management App Team`,
        };
        await transporter.sendMail(mailOptions);
      }
      res.status(200).json({ message:"update successful" });
    }
    else {
      res.status(404).json({message: "error while updating" });
    }
    }
    else{
      return res.status(403).json({message:"New Event's name is not unique"})
    }
    
  })