import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import _ from 'lodash'

import socket from '../api/socket'
import { useAuth0 } from '../../react-auth0-spa'

const EMIT_USER_TRACKER = 'USER_TRACKER'
const LISTEN_USER_TRACKER = 'USER_TRACKER_DATA'
const LOGIN_USER_TRACKER = 'LOGIN_USER_TRACKER'

const useTrackerSocket = () => {
  const [trackedUserData, setTrackedUserData] = useState({})
  const location = useLocation()
  const { user } = useAuth0()

  useEffect(() => {
    socket.emit(LOGIN_USER_TRACKER, {
      user,
      pathname: location.pathname,
    })
  }, [location.pathname])

  useEffect(() => {
    // todo: check useEffects for redundancy and explain this crazy bool
    if (!trackedUserData || !trackedUserData[user.sub] || trackedUserData[user.sub].pathname !== location.pathname) {
      socket.emit(EMIT_USER_TRACKER, {
        user,
        pathname: location.pathname,
      })
    }
  }, [location.pathname])

  socket.on(LISTEN_USER_TRACKER, data => {
    const hasDataChanged = !_.isEqual(data, trackedUserData)
    if (hasDataChanged)
      setTrackedUserData(data)
  })

  const otherUsersOnPage = Object.values(trackedUserData)
    .filter(({ user: localUser, pathname: userPathname }) => (userPathname === location.pathname
      && user.sub !== localUser.sub))

  return { otherUsersOnPage }
}

export default useTrackerSocket
