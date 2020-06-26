const userToSocketIdMap = {}
const userActivity = {}
const chatLog = {}

module.exports = io => {
  io.on('connection', socket => {
    onNavigation(socket)
    onChat(socket, io)
  })
}

function onNavigation(socket) {
  const LISTEN_USER_TRACKER = 'USER_TRACKER'
  const EMIT_USER_TRACKER = 'USER_TRACKER_DATA'

  const LOGIN_USER_TRACKER = 'LOGIN_USER_TRACKER'
  const LOGOUT_USER_TRACKER = 'LOGOUT_USER_TRACKER'

  socket.on(LISTEN_USER_TRACKER, ({ user, pathname }) => {
    updateUserActivity(userActivity, user, pathname)
    socket.emit(EMIT_USER_TRACKER, userActivity)
  })

  socket.on(LOGIN_USER_TRACKER, ({ user, pathname }) => {
    userToSocketIdMap[user.sub] = socket.client.id

    updateUserActivity(userActivity, user, pathname)
    socket.broadcast.emit(EMIT_USER_TRACKER, userActivity)
  })

  socket.on(LOGOUT_USER_TRACKER, userId => {
    delete userToSocketIdMap[userId]
    delete userActivity[userId]
    socket.broadcast.emit(EMIT_USER_TRACKER, userActivity)
  })
}

function updateUserActivity(userActivity, user, pathname) {
  if (!userActivity[user.sub]) {
    userActivity[user.sub] = {
      timestamp: new Date(),
      user,
      pathname
    }
  }
  else {
    userActivity[user.sub].pathname = pathname
    userActivity[user.sub].timestamp = new Date()
  }
}

const onChat = (socket, io) => {
  const LISTEN_USER_CHAT = 'USER_CHAT'
  const EMIT_USER_CHAT = 'USER_CHAT_DATA'

  socket.on(LISTEN_USER_CHAT, ({ toId, message, user, timestamp }) => {
    const chatKey = [toId, user.sub].sort().join('|')

    const toSocketId = userToSocketIdMap[toId]

    const payloadObj = {
      user,
      message,
      timestamp,
    }

    if (!chatLog[chatKey]) chatLog[chatKey] = [payloadObj]
    else chatLog[chatKey].push(payloadObj)

    io
      .to(`${toSocketId}`)
      .emit(EMIT_USER_CHAT, chatLog[chatKey])
    io
      .to(`${socket.client.id}`)
      .emit(EMIT_USER_CHAT, chatLog[chatKey])
  })
}
