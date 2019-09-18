const express = require("express");
const { User } = require("../models");
const { checkValidFields } = require("../utils");
const { auth } = require("../middlewares");

const router = new express.Router();

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", auth, async (req, res) => {
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
  try {
    checkValidFields(User.schema, req.body);
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(401).send({
      error: error.message
    });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();

    res.send();
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
});

router.patch("/users/:id", auth, async (req, res) => {
  try {
    checkValidFields(User.schema, req.body);
    const updates = Object.keys(req.body);
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send();
      return;
    }

    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.delete("/users/:id", auth, async (req, res) => {
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
