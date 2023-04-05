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
const router = express.Router();

router.post("/", createOrganization);
router.get("/", getOrganizations);
router.get("/requests", getOrganizationRequests);
router.get("/:id", getNPO);
router.put("/approve/:id", approveNPO);

router.get("/createpassword/:id", passwordView);
router.post("/createpassword/:id", setPassword);
router.post("/login", login);
router.put("/enroll", enrollCampaign);
router.get("/unenroll/:id", unEnroll);

export default router;
