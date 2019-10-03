import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { User } from "../models";
import { checkValidFields, MAX_AVATAR_FILE_SIZE } from "../utils";
import { auth } from "../middlewares";

const router = new Router();
const upload = multer({
  limits: {
    fileSize: MAX_AVATAR_FILE_SIZE
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/g)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
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
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
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

router.patch("/users/me", auth, async (req, res) => {
  try {
    checkValidFields(User.schema, req.body);
    const updates = Object.keys(req.body);
    const user = req.user;

    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize(250, 250)
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();

    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = null;
  await req.user.save();

  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error("Avatar not found.");
    }

    res.type("image/png").send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

export default router;
