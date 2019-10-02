import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../utils";
import { User } from "../models";

const auth = async (req, res, next) => {
  try {
    const token = (req.header('authorization') || "").replace("Bearer ", "");
    const decoded = verify(token, JWT_SECRET);
    
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
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: "You are not authenticated." });
  }
};

export default auth;
