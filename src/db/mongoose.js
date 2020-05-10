const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL,{
   useCreateIndex : true, //create indexes for faster access
   useNewUrlParser : true, //remove warnin
   useUnifiedTopology: true
});
