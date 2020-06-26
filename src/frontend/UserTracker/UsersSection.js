import React, { useState } from 'react'

import Modal from '../components/Modal'
import UserProfile from '../UserProfile'
import useChatSocket from './useChatSocket'

const profileStyle = {
  clipPath: `circle(15px at center)`,
  width: 30,
  margin: 12,
}

const UsersSection = ({ title, users }) => {
  return <div>
    <div style={{ fontWeight: 700, fontSize: 12, margin: 6, opacity: 1 }}>
      {title}
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {users.map(({ user }) => {
        return <User user={user} />
      })}
    </div>
  </div>
}

export default UsersSection

const inputStyle = {
  padding: '12px 24px',
  background: 'white',
  width: '90%',
  margin: '12px',
}

const User = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { emitMessage, chatLog } = useChatSocket(user.sub)

  return (
    <div onClick={() => setIsOpen(!isOpen)} key={user.sub}>
      <UserProfile style={profileStyle} user={user} />
      <Modal
        handleClose={() => setIsOpen(false)}
        show={isOpen}
        title={`Chatting with... ${user.name}`}
      >
        <form
          style={{ opacity: 1 }}
          onSubmit={e => {
            e.preventDefault()
            emitMessage(message)
            setMessage('')
          }}
        >
          <div>
            {chatLog}
          </div>
          <input
            style={inputStyle}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  )
}
