import express from "express";
import {
  createUser,
  login,
  getUsers,
  addTransaction,
  editPassword,
  editUser,
} from "../controller/user.js";
const router = express.Router();
import admin from "../middlewares/admin.js";
import auth from "../middlewares/auth.js";

router.post("/register", createUser);
router.post("/login", login);
// router.get("/user", auth, admin, getUsers);
router.get("/", auth, admin, getUsers);
router.put("/transaction/:id", addTransaction);
//edit routes
router.put("/edit/:id", auth, editUser);
router.put("/edit/password/:id", auth, editPassword);

export default router;
