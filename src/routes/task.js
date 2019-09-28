const express = require("express");
const { Task } = require("../models");
const { checkValidFields } = require("../utils");
const { auth } = require("../middlewares");

const router = new express.Router();

router.get("/tasks", auth, async (req, res) => {
  try {
    await req.user.populate({
      path: "tasks",
      match: {
        completed: req.query.completed || false
      }
    }).execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const result = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!result) {
      res.status(404).send();
      return;
    }

    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
});

router.post("/tasks", auth, async (req, res) => {
  try {
    checkValidFields(Task.schema, req.body);
    const task = new Task({ ...req.body, owner: req.user._id });
    const result = await task.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  try {
    checkValidFields(Task.schema, req.body);
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      res.status(404).send();
      return;
    }

    const updates = Object.keys(req.body);
    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      res.status(404).send();
      return;
    }

    await task.remove();

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
