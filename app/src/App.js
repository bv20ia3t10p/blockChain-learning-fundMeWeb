import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { fundMeABI, contractAddress } from './ABIs'

const connect = async () => {
  if (typeof window.ethereum) {
    window.ethereum.request({ method: 'eth_requestAccounts' })
  } else {
    console.log('No metamask')
  }
}

async function fund(ethAmount) {
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, fundMeABI, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
  } else {
    // fundButton.innerHTML = 'Please install MetaMask'
  }
}

const listenForTransactionMine = (transactionResponse, provider) => {
  console.log(`Mining ${transactionResponse.hash}...`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (txReceipt) => {
      console.log(`Complete with ${txReceipt.confirmations}`)
      resolve()
    })
  })
}

const getBalance = async (setBalance) => {
  if (typeof window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    setBalance(ethers.utils.formatEther(balance))
    console.log(balance)
  }
}

async function withdraw() {
  console.log(`Withdrawing...`)
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, fundMeABI, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
      await transactionResponse.wait(1)
    } catch (error) {
      console.log(error)
    }
  } else {
    // withdrawButton.innerHTML = "Please install MetaMask"
  }
}

function App() {
  const [eth, setEth] = useState(0)
  const [latestFunder, setLatestFunder] = useState('')
  const [latestAmount, getLatestAmount] = useState('')
  const [balance, setBalance] = useState('')
  return (
    <div className="App">
      <button onClick={() => connect()}>Connect wallet</button>
      <input type="text" value={eth} onChange={(e) => setEth(e.target.value)} />
      <button onClick={() => fund(eth)}>Fund</button>
      <div className="">{latestAmount}</div>
      <div className="">Balance : {balance}</div>
      <button onClick={() => getBalance(setBalance)}>Get balance</button>
    </div>
  )
}

export default App
