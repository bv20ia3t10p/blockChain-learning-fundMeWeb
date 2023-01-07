require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  defaultNetwork: 'ganache',
  networks: {
    ganache: {
      url: 'HTTP://127.0.0.1:7545',
      chainId: 1337,
      accounts: [
        'cb8cdc52dfce193112c00c0ff5827d6109a444973561e3fa7754ce3b9142a51e',
      ],
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      chainId: 5,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}
