import organization from "../models/Organization.js";

export const createOrganization = async (req, res) => {
    const { name, description, address, SECP, backdrop, isApproved, logo
     } = req.body;
    try {
        const newOrganization = new organization({
        name,
        description,
        address,
        SECP,
        backdrop,
        isApproved,
        logo,
        });
        await newOrganization.save();
        res.status(201).json(newOrganization);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
    };


export const getOrganizations = async (req, res) => {
    try {
        const organizations = await organization.find();
        res.status(200).json(organizations);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
    }
