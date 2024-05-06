import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config'
import 'solidity-coverage'

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    networks: {
        sepolia:{
          url: process.env.SEPOLIA_RPC_URL,
          accounts: [process.env.PRIVATE_KEY as string]
        }
    }
};

export default config;


