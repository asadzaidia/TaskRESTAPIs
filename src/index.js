const express = require('express');
require("./db/mongoose");
const User = require('./models/user');
const Tasks = require("./models/tasks");
const app = express();


app.use(express.json());//automatically parse json body req


const port = process.env.PORT || 3000;

app.post("/user",(req,res)=>{
    const user = new User(req.body);
    user.save().then((r)=>{
        res.send({
            ok : true,
            message : "User account created successfully!",
            data : user
        });
    }).catch((e)=>{
        res.status(400).send({
            ok : false,
            message : "Bad Request",
            error : e
        })
    });
});

app.get("/user",(req,res)=>{
    User.find({}).then((users)=>{
        res.send({
            ok : true,
            message : 'users found',
            data : users
        });
    }).catch((e)=>{
        res.status(500).send({
            ok : 500,
            message : 'something went wrong',
            error : e
        });
    })
        
});

app.get("/user/:id",(req,res)=>{
    User.findById({_id:req.params.id}).then((user)=>{
        if(!user) {
            return res.status(400).send({
                ok : false,
                message : 'user not found'
            })
        }

        res.send({
            ok : true,
            message : 'user found',
            data : user
        })
    }).catch((e)=>{
        res.status(500).send({
            ok : 500,
            message : 'something went wrong',
            error : e
        });
    })
        
});

app.post("/tasks",(req,res)=>{
    const task = new Tasks(req.body);

    task.save().then((t)=>{
        res.send({
            ok : true,
            message : 'Task created',
            data : task
        })
    }).catch((e)=>{
        res.status(400).send({
          ok : false,
          message : 'Bad request',
          error : e  
        })
    });
});

app.get("/tasks",(req,res)=>{
    Tasks.find({}).then((tasks)=>{
        res.send({
            ok : true,
            message : 'list of tasks',
            data : tasks
        })
    }).catch((e)=>{
        res.status(500).send({
            ok : false,
            message : 'something went wrong',
            error : e
        })
    })
});

app.get("/tasks/:id",(req,res)=>{
    Tasks.findById({_id:req.params.id}).then((task)=>{
        if(!task) {
           return res.status(400).send({
                ok : false,
                message : 'task not found'
            })
        }
        
        res.send({
            ok : true,
            message : 'task found',
            data : task
        })
    }).catch((e)=>{
        res.status(500).send({
            ok : false,
            message : 'something went wrong',
            error : e
        })
    })
});


app.listen(port,()=>{
    console.log('Server is running on port: '+port);
});