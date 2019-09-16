const express = require('express');
const { User } = require("../models");
const { checkValidFields } = require("../utils");

const router = new express.Router();

router.get("/users", async (req, res) => {
  try {
    const result = await User.find();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const result = await User.findById(req.params.id);

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

router.post("/users", async (req, res) => {
  checkValidFields(User.schema, req.body);
  const user = new User(req.body);

  try {
    const result = await user.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    checkValidFields(User.schema, req.body);
    const result = await User.findByIdAndUpdate(req.params.id, req.body, {
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

router.delete("/users/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);

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
