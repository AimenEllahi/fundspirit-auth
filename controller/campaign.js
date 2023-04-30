//to make get and create methods for campaigns
import Campaign from "../models/Campaign.js";
import Web3 from "web3";
import CampaignAbi from "../artifacts/contracts/Campaign.sol/Campaign.json" assert { type: "json" };
import OrganizationAbi from "../artifacts/contracts/Organization.sol/Organization.json" assert { type: "json" };
import { deploySmartContract as orgContract } from "./organization.js";
const web3 = new Web3("http://localhost:8545"); // replace with the URL of your Ethereum node
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
//to create campaigns
export const createCampaign = async (req, res) => {
  const { name, description, image, tags, subtitle } = req.body;
  console.log(req.body);

  try {
    const address = await deploySmartContract();

    const newCampaign = new Campaign({
      name,
      description,
      image,
      tags,
      subtitle,
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
        gas: gasEstimate,
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

export const disburseFunds = async (req, res) => {
  try {
    const campaign = await Campaign.findById("64235a10d9c435546517d872");

    //deploy the contract
    const address = await deploySmartContract();
    let orgAddress = await orgContract();
    const accounts = await web3.eth.getAccounts();

    const contract = await new web3.eth.Contract(CampaignAbi.abi, address);
    const Organization = await new web3.eth.Contract(
      OrganizationAbi.abi,
      orgAddress
    );

    await contract.methods.fund().send({
      from: accounts[0],
      value: web3.utils.toWei("4", "ether"),
    });

    // //get the balance of the contract

    let balance = await web3.eth.getBalance(Organization.options.address);
    //convert to ether
    let etherBalance = await web3.utils.fromWei(balance, "ether");
    console.log("Balance in org contract", etherBalance);

    balance = await web3.eth.getBalance(contract.options.address);
    etherBalance = await web3.utils.fromWei(balance, "ether");
    console.log("Balance in capaign contract", etherBalance);

    await contract.methods.enrollOrganization(orgAddress).send({
      from: accounts[0],
    });

    orgAddress = await orgContract();

    await contract.methods.enrollOrganization(orgAddress).send({
      from: accounts[0],
    });

    orgAddress = await orgContract();

    await contract.methods.enrollOrganization(orgAddress).send({
      from: accounts[0],
    });
    orgAddress = await orgContract();

    await contract.methods.enrollOrganization(orgAddress).send({
      from: accounts[0],
    });

    // // // //get the number of requests
    const npoCount = await contract.methods.getOrganizations().call();

    console.log(npoCount);

    await contract.methods.disburseFunds().call();

    balance = await Organization.methods.getBalance().call();
    etherBalance = await web3.utils.fromWei(balance, "wei");
    console.log(balance);

    balance = await web3.eth.getBalance(contract.options.address);
    etherBalance = await web3.utils.fromWei(balance, "wei");
    console.log("Balance in capaign contract", etherBalance);

    res.status(200).json({ message: "Funds disbursed" });
  } catch (error) {
    console.log(error);
  }
};

//add supported
//Like campaign
//remove like
