import express from "express";
import { createOrganization, getOrganizations } from "../controller/organization.js";
const router = express.Router();

router.post("/createOrganization", createOrganization);
router.get("/", getOrganizations);

export default router;