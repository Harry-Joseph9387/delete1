const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String, 
  },
  likedevents:{
    type:Array,
  },
  registeredevents:{
    type:Array,
  },
  organizedevents:{
    type:Array,
  }
} ); 

const UserActivity = mongoose.model('UserActivity', userSchema);

module.exports = UserActivity;
