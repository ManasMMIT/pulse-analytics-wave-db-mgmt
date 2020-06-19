import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import socket from './api/socket'
import { useAuth0 } from '../react-auth0-spa'
const EMIT_USER_TRACKER = 'USER_TRACKER'
const LISTEN_USER_TRACKER = 'USER_TRACKER_DATA'

export default () => {
  const [trackedUserData, setTrackedUserData] = useState([])
  const location = useLocation()
  const { user } = useAuth0()

  useEffect(() => {
    socket.emit(
      EMIT_USER_TRACKER,
      {
        user,
        accountIcon: null,
        location,
      }
    )
  }, [location])

  socket.on(LISTEN_USER_TRACKER, setTrackedUserData)
console.log(trackedUserData)
  return null
}
