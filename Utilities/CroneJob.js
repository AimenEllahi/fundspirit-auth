import cron from "node-cron";
import Campaign from "../models/Campaign.js";
import CampaignAbi from "../artifacts/contracts/Campaign.sol/Campaign.json" assert { type: "json" };
import web3 from "../Services/Web3.js";

export const task = async () => {
  const accounts = await web3.eth.getAccounts();
  const job = cron.schedule("*/10 * * * * *", async () => {
    try {
      const campaigns = await Campaign.find();
      console.log("Distributing");
      campaigns.forEach(async (campaign) => {
        try {
          let now = new Date();
          //updates disbure date
          await Campaign.findByIdAndUpdate(campaign._id, {
            disburseDate: now,
          });
          const contractInstance = await new web3.eth.Contract(
            CampaignAbi.abi,
            campaign.address
          );
          await contractInstance.methods.disburseFunds().send({
            from: accounts[0],
          });
        } catch (error) {
          console.log("");
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

  setTimeout(() => {
    job.start();
  }, 1000);
};
