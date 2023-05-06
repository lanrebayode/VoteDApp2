require("@nomicfoundation/hardhat-toolbox");

const privateKey = process.env.PRIVATEKEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/6fkLLSLHmiQzd943SK9A4kNEUcr1dvTf",
      accounts: [
        "9eb47393be815decc3629e0a2aeaf2d87f3ebcf68f8dfca9fece1531f0656815",
      ],
    },
  },
};
