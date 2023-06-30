import NPO from "../../../artifacts/contracts/Organization.sol/Organization.json" assert { type: "json" };
import { web3Dev as web3 } from "../../../Services/Web3.js";
export const deploySmartContract = async () => {
  try {
    const Contract = new web3.eth.Contract(NPO.abi);
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await Contract.deploy({
      data: NPO.bytecode,
    }).estimateGas();
    const contractInstance = await Contract.deploy({
      data: NPO.bytecode,
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
    return error;
  }
};
