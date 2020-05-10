require('../src/db/mongoose');
const User = require('../src/models/user');
const Tasks = require('../src/models/tasks');


User.findByIdAndUpdate('5eadd5fecf564320e0cd7e47',{age : 40}).then((user)=>{
    console.log(user);
    return User.countDocuments({age : 40 });
}).then((count)=>{
    console.log(count);
}).catch((e)=>{
    console.log(e);
})

Tasks.findByIdAndRemove({_id:'5eadd666cf564320e0cd7e4a'}).then((doc)=>{
    console.log(doc);
    return Tasks.countDocuments({completed : false});
}).then((c)=>{
    console.log(c);
}).catch((e)=>{
    console.log(e);
});