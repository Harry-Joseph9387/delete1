const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  organizer: {
    type: String,  
  },
  about: {
    type: String,
  },
  title: {
    type: String,
  },
  location: {
    type: String,
  },
  time:{
    type:String,
  },
  comments:{
    type:Array,
  },
  image:{
    type:String,
  }
} ); 

const Events = mongoose.model('Events', userSchema);

module.exports = Events;
