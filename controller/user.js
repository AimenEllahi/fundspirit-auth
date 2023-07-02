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
    res.status(500).send("Something went wrong");
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

    res.status(200).json({
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
    console.log(error.message);
    res.status(500).json({ Message: "Something Went Wrong" });
  }
};

//edit information
export const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }
    existingUser.name = name;
    existingUser.email = email;

    await existingUser.save();

    const token = jwt.sign(
      {
        _id: existingUser._id,
        name: existingUser.name,
      },
      process.env.jwtPrivateKey
    );

    res.status(200).send({
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
    console.log(error.message);
    res.status(500).send("Something Went Wrong");
  }
};

//edit password
export const editPassword = async (req, res) => {
  const { id } = req.params;
  const { password, newPassword } = req.body;

  try {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const isValid = await bcrypt.compare(password, existingUser.password);

    if (!isValid) return res.status(401).send("Current Password Incorrect");

    existingUser.password = newPassword;

    await existingUser.generateHashedPassword();
    await existingUser.save();

    res.status(200).send();
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Something Went Wrong");
  }
};
