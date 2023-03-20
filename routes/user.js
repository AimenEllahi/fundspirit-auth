import express from "express";
import { createUser, login, getUsers } from "../controller/user.js";
const router = express.Router();
import admin from "../middlewares/admin.js";
import auth from "../middlewares/auth.js";

router.post("/register", createUser);
router.post("/login", login);
router.get("/user", auth, admin, getUsers);

export default router;
