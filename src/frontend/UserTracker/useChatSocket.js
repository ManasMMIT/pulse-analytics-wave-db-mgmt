import React, { useState } from 'react'

import socket from '../api/socket'
import { useAuth0 } from '../../react-auth0-spa'

const EMIT_USER_CHAT = 'USER_CHAT'
const LISTEN_USER_CHAT = 'USER_CHAT_DATA'

const messageStyle = {
  fontSize: 14,
  padding: 12,
  borderBottom: '1px solid black',
}

const useChatSocket = (toId) => {
  const [chatLog, setChatLog] = useState([])

  const { user: entireAuth0User } = useAuth0()

  const user = {
    sub: entireAuth0User.sub,
    picture: entireAuth0User.picture,
    name: entireAuth0User.name,
  }

  const formattedResponses = chatLog
    .map(({ user: { name }, message, timestamp }) => (
      <div style={messageStyle}>
        {`${name}(${timestamp}): ${message}`}
      </div>
    ))

  const emitMessage = message => {
    socket.emit(EMIT_USER_CHAT, {
      toId,
      message,
      user,
      timestamp: new Date(),
    })
  }

  socket.on(LISTEN_USER_CHAT, chatLog => setChatLog(chatLog))

  return {
    chatLog: formattedResponses,
    emitMessage,
  }
}

export default useChatSocket
