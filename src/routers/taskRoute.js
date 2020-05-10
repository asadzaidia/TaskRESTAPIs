const express = require("express");
const Tasks = require("../models/tasks");
const router = express.Router();
const auth = require('../middleware/auth');

//below promises used for async operations!

router.post("/tasks", auth, (req, res) => {
  const task = new Tasks({
    ...req.body,
    user : req.user._id
  });

  task
    .save()
    .then((t) => {
      res.send({
        ok: true,
        message: "Task created",
        data: task,
      });
    })
    .catch((e) => {
      res.status(400).send({
        ok: false,
        message: "Bad request",
        error: e,
      });
    });
});

router.get("/tasks", auth,(req, res) => {

  Tasks.find({user:req.user._id,...req.query.completed && { completed : req.query.completed === 'true'}})
  .limit(parseInt(req.query.limit))
   .skip(parseInt(req.query.skip))
   .sort({
     ...(req.query.createdAt_asc === 'true' && {createdAt : 1}),
     ...(req.query.createdAt_des === 'true' && {createdAt : -1})
   })
    .then((tasks) => {
      res.send({
        ok: true,
        message: "list of tasks",
        data: tasks,
      });
    })
    .catch((e) => {
      res.status(500).send({
        ok: false,
        message: "something went wrong",
        error: e,
      });
    });
});

router.get("/tasks/:id", auth,(req, res) => {
  // Tasks.findById({ _id: req.params.id })
  Tasks.findOne({_id:req.params.id , user : req.user._id})
    .then((task) => {
      if (!task) {
        return res.status(400).send({
          ok: false,
          message: "task not found",
        });
      }

      res.send({
        ok: true,
        message: "task found",
        data: task,
      });
    })
    .catch((e) => {
      res.status(500).send({
        ok: false,
        message: "something went wrong",
        error: e,
      });
    });
});

router.patch("/tasks/:id",auth, (req, res) => {
  const allowedKeysToUpdate = ["description", "completed"];
  const keys = Object.keys(req.body);
  const isValidUpdation = keys.every((k) => allowedKeysToUpdate.includes(k));

  if (!isValidUpdation) {
    return res.status(404).send({
      ok: false,
      message: "Bad Request",
    });
  }
  Tasks.findOneAndUpdate({_id:req.params.id , user : req.user._id}, req.body, { new: true })
    .then((task) => {
      if(task) {
        res.send({
          ok: true,
          task: task,
          message: "Task updated successfully",
        });
      }
      else {
        res.status(404).send({
          ok: false,
          message: "Task not found",
        });
      }
      
    })
    .catch((e) => {
      res.status(500).send({
        ok: false,
        error: e,
        message: "Something went wrong",
      });
    });
});

router.delete("/tasks/:id", auth,(req, res) => {
  Tasks.findOneAndDelete({_id:req.params.id , user : req.user._id})
    .then((task) => {
      if (!task) {
        return res.status(404).send({
          ok: false,
          message: "task not found",
        });
      }

      res.send({
        ok: true,
        message: "task deleted successfully",
        task: task,
      });
    })
    .catch((e) => {
      res.status(500).send({
        ok: false,
        message: "something went wrong",
        error: e,
      });
    });
});

module.exports = router;
