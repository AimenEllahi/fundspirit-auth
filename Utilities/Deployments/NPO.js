import NPO from "../../artifacts/contracts/Organization.sol/Organization.json" assert { type: "json" };
import web3 from "../../Services/Web3.js";
const deployContract = async () => {
  const accounts = await web3.eth.getAccounts();
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
      })
      .on("error", (error) => {
        console.log(error);
      });
    return contractInstance.options.address;
  } catch (error) {
    return error;
  }
};

export default deployContract;
