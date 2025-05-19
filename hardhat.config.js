require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      gasPrice: 875000000, 
      blockGasLimit: 30000000 
    }
  }
};
