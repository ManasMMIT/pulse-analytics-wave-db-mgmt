import socket from '../api/socket'

const LOGOUT_USER_TRACKER = 'LOGOUT_USER_TRACKER'

const clearUserProfileTracker = (userId) => socket.emit(LOGOUT_USER_TRACKER, userId)

export default clearUserProfileTracker
