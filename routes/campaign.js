import express from "express";
import {
  createCampaign,
  getCampaigns,
  deploySmartContract,
  deleteAll,
  disburseFunds,
  getCampaign,
} from "../controller/campaign.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
const router = express.Router();

router.post("/create", auth, admin, createCampaign);
router.get("/", getCampaigns);
router.get("/:id", getCampaign);

// testing routes
router.get("/deploy", deploySmartContract);
router.get("/disburse", disburseFunds);

export default router;
