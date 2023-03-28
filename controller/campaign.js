//to make get and create methods for campaigns
import Campaign from "../models/Campaign.js";
import Web3 from "web3";
import CampaignFactory from "../artifacts/contracts/CampaignFactory.sol/CampaignFactory.json" assert { type: "json" };
import CampaignAbi from "../artifacts/contracts/Campaign.sol/Campaign.json" assert { type: "json" };
const web3 = new Web3("http://localhost:8545"); // replace with the URL of your Ethereum node
const provider = new Web3.providers.HttpProvider("http://localhost:8545");

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

//to create campaigns
export const createCampaign = async (req, res) => {
  const { name, description, image, tags } = req.body;

  try {
    const address = await deploySmartContract();

    const newCampaign = new Campaign({
      name,
      description,
      image,
      tags,
      address,
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

export const deploySmartContract = async () => {
  const accounts = await web3.eth.getAccounts();
  try {
    const Contract = new web3.eth.Contract(CampaignAbi.abi);
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await Contract.deploy({
      data: CampaignAbi.bytecode,
    }).estimateGas();
    const contractInstance = await Contract.deploy({
      data: CampaignAbi.bytecode,
    })
      .send({
        from: accounts[0],
        gas: 1500000,
        gasPrice,
      })
      .on("receipt", (receipt) => {});

    return contractInstance.options.address;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteAll = async (req, res) => {
  try {
    await Campaign.deleteMany();
    res.status(200).json({ message: "All campaigns deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
