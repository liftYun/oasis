import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";   // (ethers v6, chai-matchers, typechain 포함)
import "hardhat-gas-reporter";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 }
    }
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.CMC_API_KEY || "",
    showTimeSpent: true,
    outputFile: "gas-report.txt",
    noColors: true
  },
  // toolbox가 typechain 플러그인을 포함하므로 옵션만 넘겨도 됩니다.
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6"
  },
  networks: {
    hardhat: {},  // 로컬
    amoy: {
      url: process.env.INFURA_KEY
        ? `https://polygon-amoy.infura.io/v3/${process.env.INFURA_KEY}`
        : "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    sepolia: {
      url: process.env.INFURA_KEY
        ? `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`
        : "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};

export default config;
