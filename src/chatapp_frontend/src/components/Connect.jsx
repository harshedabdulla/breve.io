import React, { useState } from 'react'
import { Artemis } from 'artemis-web3-adapter'
import { chatapp_backend } from '../../../declarations/chatapp_backend'

const Connect = ({ onUserNameSubmit }) => {
  const [artemisAdapter, setArtemisAdapter] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [receiverPrincipalId, setReceiverPrincipalId] = useState('')

  const connectWallet = async () => {
    try {
      const artemisWalletAdapter = new Artemis()
      await artemisWalletAdapter.connect('plug')
      console.log('Artemis wallet connected:', artemisWalletAdapter)
      setArtemisAdapter(artemisWalletAdapter)
      setIsConnected(true)
    } catch (error) {
      console.error('Error connecting Artemis wallet:', error)
    }
  }

  const handlePrincipalIdChange = (event) => {
    setReceiverPrincipalId(event.target.value)
  }

  const handleSubmit = async () => {
    try {
      console.log('Receiver principal ID sent to backend:', receiverPrincipalId)
      chatapp_backend.receivePrincipalId(receiverPrincipalId)
    } catch (error) {
      console.error('Error sending receiver principal ID to backend:', error)
    }
  }

  return (
    <div>
      <h1>Connect to wallet</h1>
      {!isConnected && <button onClick={connectWallet}>Connect</button>}
      {isConnected && <p>Principal Id: {artemisAdapter.principalId}</p>}
      {isConnected && (
        <div>
          <div>
            Enter receiver principalId:
            <input
              type="text"
              value={receiverPrincipalId}
              onChange={handlePrincipalIdChange}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Connect
