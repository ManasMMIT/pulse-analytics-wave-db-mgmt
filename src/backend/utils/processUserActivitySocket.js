const LISTEN_USER_TRACKER = 'USER_TRACKER'
const EMIT_USER_TRACKER = 'USER_TRACKER_DATA'

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
  })
}
