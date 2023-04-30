import cron from "node-cron";
import { ethers } from "ethers";

import Campaign from "../models/Campaign.js";
import Web3 from "web3";
import CampaignAbi from "../artifacts/contracts/Campaign.sol/Campaign.json" assert { type: "json" };
import OrganizationAbi from "../artifacts/contracts/Organization.sol/Organization.json" assert { type: "json" };
import { deploySmartContract as orgContract } from "../controller/organization.js";
import { deploySmartContract as campContract } from "../controller/campaign.js";
// Connect to an Ethereum provider
// const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

// // Create an instance of the signer
// const signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);
const web3 = new Web3("http://localhost:8545"); //
// const task = cron.schedule("*/1 * * * *", async () => {
//   console.log("running a task every minute");
//   const campaigns = await Campaign.find();
//   campaigns.forEach(async (campaign) => {
//     const now = new Date();
//     //updates disbure date
//     await Campaign.findByIdAndUpdate(campaign._id, {
//       disburseDate: now,
//     });

//     const contractInstance = await new web3.eth.Contract(
//       CampaignAbi.abi,
//       campaign.address
//     );
//     await contractInstance.methods.disburseFunds().send({
//     from: accounts[0],
//  });
//   });
// });

// For testing Purposes

export const main = async () => {
  let org1 = await orgContract();
  let org2 = await orgContract();
  let org3 = await orgContract();
  let campaign = await campContract();
  const accounts = await web3.eth.getAccounts();

  const campaignInstance = await new web3.eth.Contract(
    CampaignAbi.abi,
    campaign
  );

  await campaignInstance.methods.enrollOrganization(org1).send({
    from: accounts[0],
  });
  await campaignInstance.methods.enrollOrganization(org2).send({
    from: accounts[0],
  });
  await campaignInstance.methods.enrollOrganization(org3).send({
    from: accounts[0],
  });

  const job = cron.schedule("*/10 * * * * *", async () => {
    const npo = await campaignInstance.methods.getOrganizations().call();
    console.log(npo);
    await campaignInstance.methods.disburseFunds().send({
      from: accounts[0],
    });
  });
  const fundCampaign = cron.schedule("*/10 * * * * *", async () => {
    await campaignInstance.methods.fund().send({
      from: accounts[0],
      value: web3.utils.toWei("4", "ether"),
    });
    console.log(
      "Balance of Campaign",
      await web3.eth.getBalance(campaignInstance.options.address)
    );
  });

  //   const getBalance = cron.schedule("*/10 * * * * *", async () => {
  //     console.log("Balance of Org 1", await web3.eth.getBalance(org1));
  //   });

  setTimeout(() => {
    job.start();
    fundCampaign.start();
    // getBalance.start();
  }, 10000);
};

// export const practice = cron.schedule("*/10 * * * * *", async () => {
//   console.log("Working");
// });

//Deploy campaign

//Crone job to fun campaign

//Crone job to disburse fund
