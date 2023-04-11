require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
const path = require('path');
const { SEPOLIA_API_KEY, PRIVATE_KEY } = process.env;

console.log('PRIVATE_KEY:', PRIVATE_KEY);
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.1",
  paths: {
    sources: "./src/contracts",
  },
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${SEPOLIA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${SEPOLIA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Or the URL to your local Hardhat node
    },
  },
};
