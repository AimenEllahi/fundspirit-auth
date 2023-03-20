import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

//Configuration
dotenv.config();

async function auth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(400).send("Token not provided");
  try {
    const user = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = await User.findById(user._id);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  next();
}

export default auth;
