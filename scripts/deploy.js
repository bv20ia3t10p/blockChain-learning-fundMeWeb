const { ethers, run, network } = require('hardhat')
// yarn add @chainlink/contracts
async function main() {
  const fundMeFactory = await ethers.getContractFactory('FundMe')
  console.log('Deploying contract')
  const fundMe = await fundMeFactory.deploy()
  await fundMe.deployed()
  console.log(`Deployed to: ${fundMe.address}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
