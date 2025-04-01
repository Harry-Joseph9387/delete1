const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  eventname: {
    type: String,
  },
  likedusers: {
    type: Array,
  },
  registeredusers: {
    type: Array,
  },
} ); 

const EventsInfo = mongoose.model('EventsInfo', userSchema);

module.exports = EventsInfo;
