const express = require("express");
const { Task } = require("../models");
const { checkValidFields } = require("../utils");

const router = new express.Router();

router.get("/tasks", async (req, res) => {
  try {
    const result = await Task.find();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const result = await Task.findById(req.params.id);

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

router.post("/tasks", async (req, res) => {
  try {
    checkValidFields(Task.schema, req.body);
    const task = new Task(req.body);
    const result = await task.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.patch("/tasks/:id", async (req, res) => {
  try {
    checkValidFields(Task.schema, req.body);
    const result = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!result) {
      res.status(404).send();
      return;
    }

    res.send(result);
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);

    if (!result) {
      res.status(404).send();
      return;
    }

    res.send(result);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
