import express from "express";
import {
  createCampaign,
  getCampaigns,
  deploySmartContract,
  deleteAll,
} from "../controller/campaign.js";
const router = express.Router();

router.post("/create", createCampaign);
router.get("/", getCampaigns);
router.get("/deploy", deploySmartContract);

export default router;
