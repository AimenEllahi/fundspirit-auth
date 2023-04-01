import express from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationRequests,
  getNPO,
  approveNPO,
} from "../controller/organization.js";
const router = express.Router();

router.post("/", createOrganization);
router.get("/", getOrganizations);
router.get("/requests", getOrganizationRequests);
router.get("/:id", getNPO);
router.put("/approve/:id", approveNPO);

export default router;
