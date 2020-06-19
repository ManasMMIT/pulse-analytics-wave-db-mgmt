const LISTEN_USER_TRACKER = 'USER_TRACKER'
const EMIT_USER_TRACKER = 'USER_TRACKER_DATA'

const LOGOUT_USER_TRACKER = 'LOGOUT_USER_TRACKER'

module.exports = io => {
  const userActivity = {}

  io.on('connection', socket => {
    socket.on(LISTEN_USER_TRACKER, ({ user, location }) => {
      if (!userActivity[user.sub]) {
        userActivity[user.sub] = {
          timestamp: new Date(),
          user,
          location
        }
      }
      else {
        userActivity[user.sub].location = location
        userActivity[user.sub].timestamp = new Date()
      }

      socket.emit(EMIT_USER_TRACKER, userActivity)
    })

    socket.on(LOGOUT_USER_TRACKER, userId => {
      delete userActivity[userId]
      socket.emit(EMIT_USER_TRACKER, userActivity)
    })
  })
}
