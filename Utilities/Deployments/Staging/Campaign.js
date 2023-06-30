import Campaign from "../../../artifacts/contracts/Campaign.sol/Campaign.json" assert { type: "json" };
import { web3Staging as web3 } from "../../../Services/Web3.js";
export const deployContract = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(Campaign.abi);

    const deployTx = contract.deploy({
      data: Campaign.bytecode,
    });
    const deployReceipt = await deployTx.send({
      from: accounts[0],
      gas: "5000000",
    });

    deployReceipt.on("confirmation", (confirmationNumber, receipt) => {
      console.log("=> confirmation: " + confirmationNumber);
    });

    deployReceipt.on("error", (error) => {
      return error;
    });

    console.log("Campaign deployed at address:", deployReceipt.options.address);
    return deployReceipt.options.address;
  } catch (error) {
    return error;
  }
};
//0x2945bfbdd1a80363e4ccc7fa451e8d42d51e3a0b;
