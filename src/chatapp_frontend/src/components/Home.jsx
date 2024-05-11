import React, { useState } from 'react'
import { Artemis } from 'artemis-web3-adapter'
import { chatapp_backend } from '../../../declarations/chatapp_backend'
import './style.css'

const Home = ({ onUserNameSubmit }) => {
  const [sentMessage, setSentMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleSend = async (event) => {
    event.preventDefault()
    try {
      console.log('Send message to backend:', sentMessage)
      chatapp_backend.sendMessage(sentMessage)

      const newMessage = {
        content: sentMessage,
        timestamp: new Date().toLocaleString(),
      }
      setMessages([...messages, newMessage])
      setSentMessage('')
    } catch (error) {
      console.error('Error sending message to backend:', error)
    }
  }
  const handleSendMessageChange = (event) => {
    setSentMessage(event.target.value)
  }

  return (
    <div className="connect-container">
      <div>
        <section>
          <div>
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
                  <span className="content">Message:</span> {message.content}
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
  )
}

export default Home
