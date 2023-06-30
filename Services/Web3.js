import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";

const GOERLI_RPC_URL =
  "https://eth-goerli.g.alchemy.com/v2/mN8xSkcyb0GYusRj_SlEjcrWod7pF_Cd";
const PRIVATE_KEY =
  "01c521a62a050e25290b17de15ba43651872d9ab41725c12e1a8ca453715e0e9";
const provider = new HDWalletProvider({
  privateKeys: [PRIVATE_KEY],
  providerOrUrl: GOERLI_RPC_URL,
});

const web3Staging = new Web3(provider);
const web3Dev = new Web3("http://localhost:8545");

export { web3Staging, web3Dev };
