const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/task-manager-api",{
   useCreateIndex : true, //create indexes for faster access
   useNewUrlParser : true //remove warnin
});
