import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import _ from 'lodash'

import socket from './api/socket'
import { useAuth0 } from '../react-auth0-spa'

import UserProfile from './UserProfile'

const EMIT_USER_TRACKER = 'USER_TRACKER'
const LISTEN_USER_TRACKER = 'USER_TRACKER_DATA'
const LOGOUT_USER_TRACKER = 'LOGOUT_USER_TRACKER'

const wrapperStyle = {
  position: 'absolute',
  bottom: 12,
  right: 12,
}

export default () => {
  const [trackedUserData, setTrackedUserData] = useState({})
  const location = useLocation()
  const { user } = useAuth0()

  if (!trackedUserData || !trackedUserData[user.sub] || trackedUserData[user.sub].location.pathname !== location.pathname) {
    socket.emit(
      EMIT_USER_TRACKER,
      {
        user,
        location,
      }
    )
  }

  socket.on(LISTEN_USER_TRACKER, data => {
    if (!_.isEqual(data, trackedUserData)) setTrackedUserData(data)
  })

  console.log(trackedUserData)
  // TODO: Hide own facebub
  return (
    <div style={wrapperStyle}>
      {
        Object.values(trackedUserData).map(({ user, location: userLocation }) => {
          let profileStyle = { opacity: 0.2 }
          if (userLocation.pathname === location.pathname) profileStyle = { opacity: 1 }

          return (
              <UserProfile style={profileStyle} key={user.sub} user={user} />
          )
        })
      }
    </div>
  )
}

export const clearUserProfileTracker = (userId) => socket.emit(LOGOUT_USER_TRACKER, userId)
