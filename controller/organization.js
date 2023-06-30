import NPO from "../models/Organization.js";
import Campaign from "../models/Campaign.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { web3Staging, web3Dev } from "../Services/Web3.js";
import _ from "lodash";
import { sendEmail } from "../Utilities/NodeMailer.js";
import CampaignAbi from "../artifacts/contracts/Campaign.sol/Campaign.json" assert { type: "json" };
import { deploySmartContract } from "../Utilities/Deployments/Development/NPO.js";
import { deployContract } from "../Utilities/Deployments/Staging/NPO.js";

//dev
const web3 = web3Dev;

//staging
// const web3 = web3Staging;

const accounts = await web3.eth.getAccounts();

export const createOrganization = async (req, res) => {
  const {
    name,
    category,
    email,
    address,
    website,
    description,
    logo,
    coverImage,
    secp,
    secpCert,
    ceoName,
    ceoEmail,
    ceoPhone,
    goals,
    requestedBy,
    foundThrough,
  } = req.body;

  try {
    //dev
    const addressHash = await deploySmartContract();
    //staging
    // const addressHash = await deployContract();
    const newOrganization = new NPO({
      addressHash,
      name,
      category,
      email: email.toLowerCase(),
      address,
      website,
      description,
      logo,
      coverImage,
      secp,
      secpCert,
      ceoName,
      ceoEmail,
      ceoPhone,
      goals,
      requestedBy,
      foundThrough,
    });
    await newOrganization.save();

    res.status(201).json(newOrganization);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await NPO.find({ isApproved: true });

    res.status(200).json(organizations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getOrganizationRequests = async (req, res) => {
  try {
    const organizations = await NPO.find({ isApproved: false });

    res.status(200).json(organizations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getNPO = async (req, res) => {
  const { id } = req.params;
  try {
    const organization = await NPO.findById(id);

    res.status(200).json(organization);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const approveNPO = async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await NPO.findByIdAndUpdate(
      id,
      { isApproved: true, approveDate: new Date().toISOString() },
      { new: true }
    );

    sendEmail(organization.email, organization.name, organization._id);
    res.status(200).json(organization);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const passwordView = (req, res) => {
  const { id } = req.params;

  // Node.js code
  const errorMessage = "";
  res.render("createPassword", { errorMessage, id });
};

export const setPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id } = req.params;
  if (password !== confirmPassword) {
    res.render("createPassword", { errorMessage: "Passwords do not match" });
  } else {
    try {
      const hashedPassword = await bcrypt.hashSync(password, 10);

      const npo = await NPO.findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true }
      );
      res.render("passwordSet", {
        message: "Password Set, You can now login to FundSpirit",
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const npo = await NPO.findOne({ email: email.toLowerCase() });

    if (!npo) return res.status(404).send("Email or Password Incorrect");

    const isPasswordCorrect = await bcrypt.compare(password, npo.password);

    if (!isPasswordCorrect)
      return res.status(400).send("Email or Password Incorrect");

    const token = jwt.sign(
      {
        _id: npo._id,
        name: npo.name,
      },
      process.env.jwtPrivateKey
    );

    // //pick everything except password
    // const npoDetails = _.pick(npo, [
    //   "addressHash",
    //   "name",
    //   "category",
    //   "email",
    //   "address",
    //   "website",
    //   "description",
    //   "logo",
    //   "coverImage",
    //   "secp",
    //   "ceoName",
    //   "ceoEmail",
    //   "ceoPhone",
    //   "goals",
    //   "requestedBy",
    //   "foundThrough",
    //   "isApproved",
    // ]);

    res.status(200).json({ token, npo });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const enrollCampaign = async (req, res) => {
  const { id, campaignId } = req.body;

  try {
    const existingNPO = await NPO.findById(id);
    const existingCampaign = await Campaign.findById(campaignId);
    if (!existingNPO) return res.status(404).json({ message: "NPO not found" });

    if (existingNPO.campaigns.includes(campaignId)) {
      return res.status(400).json({ message: "Already enrolled" });
    }
    if (existingNPO.campaigns.length >= 3)
      return res
        .status(400)
        .json({ message: "You can only enroll in 3 campaigns" });
    if (!existingCampaign)
      return res.status(404).json({ message: "Campaign not found" });

    const campaignSM = await new web3.eth.Contract(
      CampaignAbi.abi,
      existingCampaign.address
    );
    await campaignSM.methods.enrollOrganization(existingNPO.addressHash).send({
      from: accounts[0],
    });

    const updatedNPO = await NPO.findByIdAndUpdate(
      id,
      {
        campaigns: [...existingNPO.campaigns, campaignId],
      },
      {
        new: true,
      }
    );

    await Campaign.findByIdAndUpdate(
      campaignId,
      {
        enrolledNPOs: [...existingCampaign.enrolledNPOs, id],
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedNPO);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
};

export const unEnroll = async (req, res) => {
  const { id } = req.params;
  try {
    await NPO.findByIdAndUpdate(id, {
      campaigns: [],
    });
    res.status(200).json({ message: "Unenrolled" });
  } catch (err) {}
};

// export const deductFunds = async (req, res) => {
//   const { npoId, amount } = req.body;

//   try {
//     // Find the NPO by ID
//     const npo = await NPO.findById(npoId);
//     if (!npo) {
//       return res.status(404).json({ message: "NPO not found" });
//     }

//     // Deduct funds from the NPO's account/wallet
//     const npoContract = new web3.eth.Contract(OrganizationAbi.abi, npo.addressHash);
//     await npoContract.methods.deductFunds(amount).send({
//       from: npo.walletAddress, // Assuming the NPO has a wallet address associated
//     });

//     // Calculate the remaining balance after deducting the transfer amount
//     const remainingBalance = await npoContract.methods.getBalance().call();

//     res.status(200).json({ remainingBalance });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to deduct funds", error: error.message });
//   }
// };
