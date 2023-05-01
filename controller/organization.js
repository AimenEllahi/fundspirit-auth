import NPO from "../models/Organization.js";
import Campaign from "../models/Campaign.js";
import bcrypt from "bcryptjs";
import Web3 from "web3";
import _ from "lodash";

import { sendEmail } from "../Utilities/NodeMailer.js";
import OrganizationAbi from "../artifacts/contracts/Organization.sol/Organization.json" assert { type: "json" };
import CampaignAbi from "../artifacts/contracts/Campaign.sol/Campaign.json" assert { type: "json" };
const web3 = new Web3("http://localhost:8545"); // replace with the URL of your Ethereum node
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
    const addressHash = await deploySmartContract();
    const newOrganization = new NPO({
      addressHash,
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
    });
    await newOrganization.save();

    res.status(201).json(newOrganization);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deploySmartContract = async (id) => {
  try {
    const Contract = new web3.eth.Contract(OrganizationAbi.abi);
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await Contract.deploy({
      data: OrganizationAbi.bytecode,
    }).estimateGas();
    const contractInstance = await Contract.deploy({
      data: OrganizationAbi.bytecode,
    })
      .send({
        from: accounts[0],
        gas: gasEstimate,
        gasPrice,
      })
      .on("receipt", (receipt) => {});

    return contractInstance.options.address;
  } catch (error) {
    return error;
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
    res.status(404).json({ message: error.message });
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
      res.status(200).json(npo);
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
    const npo = await NPO.findOne({ email: email });

    if (!npo) return res.status(404).send("Email or Password Incorrect");

    const isPasswordCorrect = await bcrypt.compare(password, npo.password);

    if (!isPasswordCorrect)
      return res.status(400).send("Email or Password Incorrect");

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

    res.status(200).json(npo);
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
      console.log("Already enrolled");
      res.status(400).json({ message: "Already enrolled" });
      return;
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
