import React, { useState, useEffect } from 'react'
import { Artemis } from 'artemis-web3-adapter'
import { chatapp_backend } from '../../../declarations/chatapp_backend'
import './style.css'

const Chats = ({ onUserNameSubmit }) => {
  const [artemisAdapter, setArtemisAdapter] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [receiverPrincipalId, setReceiverPrincipalId] = useState('')
  const [sentMessage, setSentMessage] = useState('')
  const [messages, setMessages] = useState(() => {
    // Retrieve messages from localStorage on component mount
    const storedMessages = localStorage.getItem('chatapp_messages')
    return storedMessages ? JSON.parse(storedMessages) : []
  })

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
    console.log('Receiver principal ID changed:', event.target.value)
    setReceiverPrincipalId(event.target.value)
  }

  const handleSendMessageChange = (event) => {
    console.log('Message changed:', event.target.value)
    setSentMessage(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      console.log('Receiver principal ID sent to backend:', receiverPrincipalId)
      chatapp_backend.receivePrincipalId(receiverPrincipalId)
    } catch (error) {
      console.error('Error sending receiver principal ID to backend:', error)
    }
  }

  const handleSend = async (event) => {
    event.preventDefault()
    try {
      console.log('Send message to backend:', sentMessage)
      chatapp_backend.sendMessage(sentMessage)

      const newMessage = {
        sender: artemisAdapter.principalId,
        content: sentMessage,
        timestamp: new Date().toLocaleString(),
      }
      console.log('New message:', newMessage)
      setMessages([...messages, newMessage])
      console.log('Messages after sending:', messages)
      setSentMessage('')

      // Store messages in localStorage
      localStorage.setItem(
        'chatapp_messages',
        JSON.stringify([...messages, newMessage])
      )
    } catch (error) {
      console.error('Error sending message to backend:', error)
    }
  }

  useEffect(() => {
    console.log('Polling for new messages...')
    const interval = setInterval(async () => {
      try {
        const newMessages = await chatapp_backend.getMessages()
        console.log('New messages retrieved:', newMessages)
        setMessages(newMessages)
        console.log('Messages after polling:', newMessages)
        // Store messages in localStorage
        localStorage.setItem('chatapp_messages', JSON.stringify(newMessages))
      } catch (error) {
        console.error('Error retrieving messages:', error)
      }
    }, 10000) // Poll every 10 seconds

    // Clean up the interval on component unmount
    return () => {
      console.log('Clearing interval...')
      clearInterval(interval)
    }
  }, []) // No dependency array, so the effect runs on every render

  return (
    <div className="connect-container">
      <h1 className="connect-header">Connect to wallet</h1>
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
            <section>
              <div>
                <h2>Send message: </h2>
                <form onSubmit={handleSend}>
                  <input
                    type="text"
                    value={sentMessage}
                    onChange={handleSendMessageChange}
                  />
                  <button type="submit">Send</button>
                </form>
              </div>
              <div className="message-container">
                <h3>Messages:</h3>
                {messages.map((message, index) => (
                  <div className="message" key={index}>
                    <p>
                      <span className="sender">Sender:</span> {message.sender}
                    </p>
                    <p>
                      <span className="content">Message:</span>{' '}
                      {message.content}
                    </p>
                    <p>
                      <span className="timestamp">Timestamp:</span>{' '}
                      {message.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chats
