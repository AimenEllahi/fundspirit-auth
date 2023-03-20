import User from "../models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import _ from "lodash";

//Configuration
dotenv.config();

export const createUser = async (req, res) => {
  console.log("Creating User");
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email: email });
  if (existingUser)
    return res.status(400).send("User with given email already exists");
  const user = new User({
    name,
    email: email,
    password,
  });

  await user.generateHashedPassword();

  try {
    const savedUser = await user.save();

    res.json(_.pick(savedUser, ["name", "email"]));
  } catch (err) {
    res.json({ message: err });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) return res.status(400).send("User is not registered");
  const isValid = await bcrypt.compare(password, existingUser.password);
  if (!isValid) return res.status(401).send("Invalid Password");
  const token = jwt.sign(
    {
      _id: existingUser._id,
      name: existingUser.name,
    },
    process.env.jwtPrivateKey
  );
  console.log(token);
  res.send({ token, user: _.pick(existingUser, ["name", "email", "role"]) });
};

export const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};
