import { useEffect } from 'react'
import { ethers } from 'ethers'

const connect = async () => {
  if (typeof window.ethereum) {
    window.ethereum.request({ method: 'eth_requestAccounts' })
  } else {
    console.log('No metamask')
  }
}

const fund = async (ethAmount)=> {
  alert(`Funding with ${ethAmount}`)
  if (!typeof window.etherum)
}

function App() {
  useEffect(() => {
    connect()
  }, [])
  return (
    <div className="App">
      <button onClick={() => connect()}>Connect wallet</button>
    </div>
  )
}

export default App
