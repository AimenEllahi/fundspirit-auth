import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import NPO from "../models/Organization.js";
//Configuration
dotenv.config();

async function auth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(400).send("Token not provided");
  try {
    const npo = jwt.verify(token, process.env.jwtPrivateKey);

    req.npo = await NPO.findById(npo._id);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  next();
}

export default auth;
