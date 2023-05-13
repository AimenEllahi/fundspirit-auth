import express from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationRequests,
  getNPO,
  approveNPO,
  setPassword,
  passwordView,
  login,
  enrollCampaign,
  unEnroll,
} from "../controller/organization.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import npoAuth from "../middlewares/npoAuth.js";
const router = express.Router();

router.post("/", createOrganization);
router.get("/", getOrganizations);
router.get("/requests", auth, admin, getOrganizationRequests);
router.get("/:id", getNPO);
router.put("/approve/:id", auth, admin, approveNPO);
router.get("/createpassword/:id", passwordView);
router.post("/createpassword/:id", setPassword);
router.post("/login", login);
router.put("/enroll", npoAuth, enrollCampaign);

//test route
router.get("/unenroll/:id", unEnroll);

export default router;
