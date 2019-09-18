const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils");
const { User } = require("../models");

const auth = async (req, res, next) => {
  try {
    const token = (req.header('authorization') || "").replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!token) {
      throw new Error("Token not provided.");
    }

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });

    if (!user) {
      throw new Error("Invalid token.");
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "You are not authenticated." });
  }
};

module.exports = auth;
