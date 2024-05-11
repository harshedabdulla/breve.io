import React, { useState, useEffect } from 'react'
import { Artemis } from 'artemis-web3-adapter'
import { chatapp_backend } from '../../../declarations/chatapp_backend'
import './style.css'

const Chats = ({ onUserNameSubmit }) => {
  const [artemisAdapter, setArtemisAdapter] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [receiverPrincipalId, setReceiverPrincipalId] = useState('')
  const [sentMessage, setSentMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [data, setData] = useState(null)
  const [messagesData, setMessagesData] = useState([])

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Call the getMessages function here
        const messages = await chatapp_backend.getMessages()
        console.log('Messages:', messages)
        setMessagesData(messages)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    // Call fetchMessages initially and then every 10 seconds
    fetchMessages()
    const intervalId = setInterval(fetchMessages, 10000)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, []) // Empty dependency array ensures this effect runs only once on mount

  const handlePrincipalIdChange = (event) => {
    setReceiverPrincipalId(event.target.value)
  }

  const handleSendMessageChange = (event) => {
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
  const checkToxicity = async (message) => {
    // Replace with your actual Gemini API key
    
    const apiKey = 'AIzaSyBSX1CACqI6S9OBscb7TT08INLWiw7deL0'
    const prompt = "reply me either 1 or 0, analyse the text for charecterestics that might be harrassing and return 1 if you find harrassing charecters else 0 if not "

    const url = new URL('https://api.gemini.ai/v1/predict/toxicity')
    url.searchParams.append('text', message)
    url.searchParams.append('api_key', apiKey)

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Error fetching toxicity prediction')
        console.error('Error fetching toxicity prediction')
      }

      const data = await response.json()
      console.log('Toxicity prediction:', data)
      const isToxic = data.results[0].toxicity > 0.5 // Adjust threshold as needed
      console.log('Is toxic:', isToxic)
      return isToxic ? 'toxic' : 'non-toxic'
    } catch (error) {
      console.error('Error checking message toxicity:', error)
      return 'unknown' // Handle potential errors gracefully
    }
  }

  const handleSend = async (event) => {
    event.preventDefault()
    try {
      console.log('Send message to backend:', sentMessage)
      const isToxic = await checkToxicity(sentMessage)

      if (isToxic === 'toxic') {
        // Handle toxic message (e.g., warn user, don't send)
        console.warn('Message is considered toxic')
        return
      }

      chatapp_backend.sendMessage(sentMessage, artemisAdapter.principalId)

      const newMessage = {
        sender: artemisAdapter.principalId,
        content: sentMessage,
        timestamp: new Date().toLocaleString(),
      }
      setMessages([...messages, newMessage])
      setSentMessage('')
    } catch (error) {
      console.error('Error sending message to backend:', error)
    }
  }

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
                <h3>Send Messages:</h3>
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
              <div className="message-container">
                <h3>Received Messages:</h3>
                {messagesData.length > 0 && (
                  <div className="message" key={messagesData.length - 1}>
                    <p>
                      <span className="sender">Sender:</span>{' '}
                      {messagesData[messagesData.length - 1].sender}
                    </p>
                    <p>
                      <span className="content">Message:</span>{' '}
                      {messagesData[messagesData.length - 1].content}
                    </p>
                    <p>
                      <span className="timestamp">Timestamp:</span>{' '}
                      {messagesData[messagesData.length - 1].timestamp}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chats
