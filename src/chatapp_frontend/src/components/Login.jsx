import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import { Artemis } from 'artemis-web3-adapter'
import './login.css'

const Login = () => {
  const [artemisAdapter, setArtemisAdapter] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const navigate = useNavigate() // Initialize useNavigate

  const connectWallet = async () => {
    try {
      const artemisWalletAdapter = new Artemis()
      await artemisWalletAdapter.connect('plug')
      console.log('Artemis wallet connected:', artemisWalletAdapter)
      setArtemisAdapter(artemisWalletAdapter)
      setIsConnected(true)
      console.log('navigate:', navigate) // Log the value of navigate
      navigate('/home')
    } catch (error) {
      console.error('Error connecting Artemis wallet:', error)
    }
  }

  return (
    <div className="login">
      <div className="item">
        <h2>Connect to your wallet</h2>
        {!isConnected && <button onClick={connectWallet}>Connect</button>}
      </div>
    </div>
  )
}

export default Login
