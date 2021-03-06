import { Router } from "express";
import { Task } from "../models";
import { checkValidFields } from "../utils";
import { auth } from "../middlewares";

const router = new Router();

router.get("/tasks", auth, async (req, res) => {
  const {sortBy} = req.query;
  const sortParts = sortBy ? sortBy.split('_') : null;

  try {
    await req.user.populate({
      path: "tasks",
      match: {
        completed: req.query.completed || false
      },
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort: sortParts ? {
          [sortParts[0]]: sortParts[1]
        } : null
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

    res.send(result);
  } catch (error) {
    res.status(404).send();
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

    await task.remove();

    res.send(task);
  } catch (error) {
    res.status(404).send();
  }
});

export default router;
