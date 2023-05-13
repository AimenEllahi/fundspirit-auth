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
  console.log(existingUser);
  if (existingUser) return res.status(400).send("Email Already Registered");
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
    res.json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser)
      return res.status(400).send("Email or Password Incorrect");

    const isValid = await bcrypt.compare(password, existingUser.password);

    if (!isValid) return res.status(401).send("Email or Password Incorrect");
    const token = jwt.sign(
      {
        _id: existingUser._id,
        name: existingUser.name,
      },
      process.env.jwtPrivateKey
    );
    res.send({
      token,
      user: _.pick(existingUser, [
        "name",
        "email",
        "role",
        "_id",
        "campaignsFunded",
        "campaignsLiked",
        "transactions",
        "totalFunding",
      ]),
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const user = await User.find();

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
    const existingUser = await User.findById(id);
    if (!existingUser) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    existingUser.transactions.push(details);
    if (existingUser.campaignsFunded.indexOf(details.campaign.id) === -1) {
      existingUser.campaignsFunded.push(details.campaign.id);
    }
    existingUser.totalFunding += Number(details.amount);
    await existingUser.save();

    res.status(200).json(existingUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ Message: "Something Went Wrong" });
  }
};
