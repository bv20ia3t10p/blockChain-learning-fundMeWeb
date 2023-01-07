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

function App() {
  const [eth, setEth] = useState(0)
  const [latestFunder, setLatestFunder] = useState('')
  const [latestAmount, getLatestAmount] = useState('')
  return (
    <div className="App">
      <button onClick={() => connect()}>Connect wallet</button>
      <input type="text" value={eth} onChange={(e) => setEth(e.target.value)} />
      <button onClick={() => fund(eth)}>Fund</button>
      <div className="">{latestAmount}</div>
    </div>
  )
}

export default App
