import NPO from "../../../artifacts/contracts/Organization.sol/Organization.json" assert { type: "json" };
import { web3Staging as web3 } from "../../../Services/Web3.js";
export const deployContract = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(NPO.abi);

    const deployTx = contract.deploy({
      data: NPO.bytecode,
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

    console.log(
      "Organization deployed at address:",
      deployReceipt.options.address
    );
    return deployReceipt.options.address;
  } catch (error) {
    return error;
  }
};
