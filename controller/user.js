import User from "../models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import _ from "lodash";

//Configuration
dotenv.config();

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email: email });
  if (existingUser)
    return res.status(400).send("User with given email already exists");
  const user = new User({
    name,
    email,
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
  try {
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
    res.send({
      token,
      user: _.pick(existingUser, ["name", "email", "role", "_id"]),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getUsers = async (req, res) => {
  console.log("Getting Users");
  try {
    const user = await User.find();
    console.log(user);
    user
      ? res.status(200).json(user)
      : res.status(200).json({ message: "No Users Found" });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

export const addTransaction = async (req, res) => {
  const details = req.body;
  const { id } = req.params;
  try {
    console.log(id);
    const existingUser = await User.findById(id);
    if (!existingUser) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    console.log(existingUser._id);
    existingUser.transactions.push(details);
    existingUser.campaignsFunded.push(details.campaign.id);
    existingUser.totalFunding += details.amount;
    await existingUser.save();

    res.status(200).json(existingUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ Message: "Something Went Wrong" });
  }
};
