const LISTEN_USER_TRACKER = 'USER_TRACKER'
const EMIT_USER_TRACKER = 'USER_TRACKER_DATA'

const LOGIN_USER_TRACKER = 'LOGIN_USER_TRACKER'
const LOGOUT_USER_TRACKER = 'LOGOUT_USER_TRACKER'

module.exports = io => {
  const userActivity = {}

  io.on('connection', socket => {
    socket.on(LISTEN_USER_TRACKER, ({ user, pathname }) => {
      updateUserActivity(userActivity, user, pathname)

      socket.emit(EMIT_USER_TRACKER, userActivity)
    })

    socket.on(LOGIN_USER_TRACKER, ({ user, pathname }) => {
      updateUserActivity(userActivity, user, pathname)

      socket.broadcast.emit(EMIT_USER_TRACKER, userActivity)
    })

    socket.on(LOGOUT_USER_TRACKER, userId => {
      delete userActivity[userId]
      socket.broadcast.emit(EMIT_USER_TRACKER, userActivity)
    })
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
