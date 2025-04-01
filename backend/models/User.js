const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,  
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  admin:{
    type:String,
  },
  bio:{
    type:String,
  },
  location:{
    type:String,
  },
  image:{
    type:String
  }
} ); 

const User = mongoose.model('User', userSchema);

module.exports = User;
