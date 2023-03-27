//to make get and create methods for campaigns
import Campaign from "../models/campaign.js";

//to create campaigns
export const createCampaign = async (req, res) => {
    const { name, description, image, tags } = req.body;
    try {
        const newCampaign = new Campaign({
        name,
        description,
        image,
        tags,
        });
        await newCampaign.save();
        res.status(201).json(newCampaign);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
    };

//to get all campaigns
export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
    };

