require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

const { ALCHEMY_KEY, ACCOUNT_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
    defaultNetwork: "sepolia",
    networks: {
        hardhat: {},
        goerli: {
            url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_KEY}`,
            accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
        },
        sepolia: {
            chainId: 11155111,
            url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
            accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
        },
        ethereum: {
            chainId: 1,
            url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
            accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
        },
        mumbai: {
            chainId: 80001,
            url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`,
            accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    solidity: {
        version: "0.8.15",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            viaIR: true
        },
    },
    // paths: {
    //     sources: "./contracts",
    //     tests: "./test",
    //     cache: "./cache",
    //     artifacts: "./build",
    // },
    mocha: {
        timeout: 40000,
    },
};