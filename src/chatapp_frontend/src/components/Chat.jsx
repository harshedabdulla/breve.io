import React, { useState, useEffect } from 'react'
import { Artemis } from 'artemis-web3-adapter'
import { chatapp_backend } from '../../../declarations/chatapp_backend'
import './style.css'

const Chat = ({ onUserNameSubmit }) => {
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

  const handleSend = async (event) => {
    event.preventDefault()
    try {
      console.log('Send message to backend:', sentMessage)
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
      <div>
        <div>
          <section>
            <div>
              <h2>Send message: </h2>
              <form onSubmit={handleSend}>
                <input
                  className="input-message"
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
                    <span className="content">Message:</span> {message.content}
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
    </div>
  )
}

export default Chat
