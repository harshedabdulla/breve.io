import './chat.css'
import { useState } from 'react'
import { chatapp_backend } from '../../../declarations/chatapp_backend'

const Chat = () => {
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
    <div className="chat">
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <div className="message-container">
          <form onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type a message..."
              value={sentMessage}
              onChange={handleSendMessageChange}
            />
            <div className="emoji">
              <img src="./emoji.png" alt="" />
            </div>
            <button className="sendButton">Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat
