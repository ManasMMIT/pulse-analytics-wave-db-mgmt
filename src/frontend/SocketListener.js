import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import _ from 'lodash'

import socket from './api/socket'
import { useAuth0 } from '../react-auth0-spa'

import UserProfile from './UserProfile'

const EMIT_USER_TRACKER = 'USER_TRACKER'
const LISTEN_USER_TRACKER = 'USER_TRACKER_DATA'
const LOGIN_USER_TRACKER = 'LOGIN_USER_TRACKER'
const LOGOUT_USER_TRACKER = 'LOGOUT_USER_TRACKER'

const wrapperStyle = {
  opacity: 0.4,
  position: 'absolute',
  bottom: 0,
  right: 0,
  maxWidth: '50%',
  display: 'flex',
  color: '#8266fa',
  background: 'rgb(242, 239, 254)',
}

const profileStyle = {
  clipPath: `circle(15px at center)`,
  width: 30,
  margin: 12,
}

export default () => {
  const [isOpen, setIsOpen] = useState(false)
  const [trackedUserData, setTrackedUserData] = useState({})
  const location = useLocation()
  const { user } = useAuth0()

  useEffect(() => {
    socket.emit(
      LOGIN_USER_TRACKER,
      {
        user,
        pathname: location.pathname,
      }
    )
  }, [location.pathname])

  useEffect(() => {
    if (!trackedUserData || !trackedUserData[user.sub] || trackedUserData[user.sub].pathname !== location.pathname) {
      socket.emit(
        EMIT_USER_TRACKER,
        {
          user,
          pathname: location.pathname,
        }
      )
    }
  }, [location.pathname])

  socket.on(LISTEN_USER_TRACKER, data => {
    const hasDataChanged = !_.isEqual(data, trackedUserData)
    if (hasDataChanged) setTrackedUserData(data)
  })

  const filteredUserActivity = Object.values(trackedUserData)
    .filter(({ user: localUser, pathname: userPathname }) => (
      userPathname === location.pathname
        && user.sub !== localUser.sub
      ))

  if (!filteredUserActivity.length) return null

  return (
    <div style={isOpen ? { ...wrapperStyle, opacity: 0.7 } : wrapperStyle}>
      <div style={{ margin: 12, alignSelf: 'center', opacity: .8 }} onClick={() => setIsOpen(!isOpen)}>{"<"}</div>
      { isOpen && (
        <div>
          <div style={{ fontSize: 12, margin: 6, opacity: 1 }}>
            Users on this page
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {
              filteredUserActivity.map(({ user, pathname }) => {
                return (
                  <UserProfile
                    style={profileStyle}
                    key={user.sub}
                    user={user}
                  />
                )
              })
            }
          </div>
        </div>
      )}
    </div>
  )
}

export const clearUserProfileTracker = (userId) => socket.emit(LOGOUT_USER_TRACKER, userId)
