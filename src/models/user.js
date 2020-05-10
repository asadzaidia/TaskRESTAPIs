const mongoose = require('mongoose');
const validator = require('validator');
const brcypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const Task = require('../models/tasks');

const userSchema = mongoose.Schema({
   name : {
      type : String,
      required : true,
      trim : true
   },
   email : {
      type : String,
      required : true,
      unique : true,
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
   },
   avatar : {
      type : Buffer
   }
},{
   "timestamps" : true
});

//runs everytime user object is returning and hides secret password
userSchema.methods.toJSON = function() {
   const user = this;
   const userObject = user.toObject();

   delete userObject.password;
   delete userObject.avatar;
   return userObject;
}

//instance level (method)
userSchema.methods.getAuthToken = async function (){
   const user = this;
   const token = jwt.sign({_id : user._id.toString()},process.env.JWT_SECRET,{ expiresIn: '1h' });
   return token;
}

//Modal level (statics)
userSchema.statics.findUserByCrendentials= async(email = '',password = '')=>{
   const user = await User.findOne({email});

   if(!user) {
      throw new Error('Invalid Email or Password');
   }

   const isMatch = await brcypt.compare(password,user.password);

   if(!isMatch) {
      throw new Error('Invalid Email or Password');
   }

   return user;
};

userSchema.pre('save',async function(next){
   const user = this;
   if(user.isModified('password')) {
      user.password = await brcypt.hash(user.password,8);
   }

   next();
});

//cascade delete user is deleted to its task need to be deleted as well
userSchema.pre('remove',async function(next) {
   const user = this;
   console.log(user);
   await Task.deleteMany({user : user._id}); 

   next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;