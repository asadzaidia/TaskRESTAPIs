const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User',{
    name : {
       type : String,
       required : true,
       trim : true
    },
    email : {
       type : String,
       required : true,
       trim : true,
       lowercase : true,
       validate(value) {
          if(!validator.isEmail(value)) {
             throw new Error('Email is not valid')
          }
       }
    },
    age : {
       type : Number,
       default : 18,
       validate(value) {
          if(value < 0) {
             throw new Error('Age must not be less than 0')
          }
       }
    },
    password : {
       type: String,
       required : true,
       minlength : 7,
       trim : true,
       validate(value) {
          if(value === "password") {
             throw new Error("Password is not valid try different");
          }
       }
    }
 });


 module.exports = User;