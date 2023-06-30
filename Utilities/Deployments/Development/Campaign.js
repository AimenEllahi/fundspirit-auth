import Campaign from "../../../artifacts/contracts/Campaign.sol/Campaign.json" assert { type: "json" };
import { web3Dev as web3 } from "../../../Services/Web3.js";
export const deploySmartContract = async () => {
  const accounts = await web3.eth.getAccounts();
  try {
    const Contract = new web3.eth.Contract(Campaign.abi);
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await Contract.deploy({
      data: Campaign.bytecode,
    }).estimateGas();
    const contractInstance = await Contract.deploy({
      data: Campaign.bytecode,
    })
      .send({
        from: accounts[0],
        gas: gasEstimate,
        gasPrice,
      })
      .on("receipt", (receipt) => {
        console.log(receipt);
      });

    return contractInstance.options.address;
  } catch (error) {
    console.log(error);
    return error;
  }
};

//0x2945bfbdd1a80363e4ccc7fa451e8d42d51e3a0b;
