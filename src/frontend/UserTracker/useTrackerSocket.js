import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import _ from 'lodash'

import socket from '../api/socket'
import { useAuth0 } from '../../react-auth0-spa'

const EMIT_USER_TRACKER = 'USER_TRACKER'
const LISTEN_USER_TRACKER = 'USER_TRACKER_DATA'
const LOGIN_USER_TRACKER = 'LOGIN_USER_TRACKER'

// ! HACK DAY NOTE: Headers eventually get too large and fail! Had to clear cookies to fix this. Why are the cookies growing??

const useTrackerSocket = () => {
  const [trackedUserData, setTrackedUserData] = useState({})
  const location = useLocation()
  const { user: entireAuth0User } = useAuth0()

  const user = {
    sub: entireAuth0User.sub,
    picture: entireAuth0User.picture,
    name: entireAuth0User.name,
  }

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

  const otherUsers = Object.values(trackedUserData).filter(({ user: localUser}) => user.sub !== localUser.sub)

  const otherUsersOnPage = otherUsers
    .filter(({ pathname: userPathname }) => userPathname === location.pathname)

  const otherUsersOnTool = getOtherUsersOnTool(otherUsers, location.pathname)

  return {
    otherUsersOnPage,
    otherUsersOnTool,
  }
}

export default useTrackerSocket

const TOOL_PATHS = ['/orion', '/phoenix', '/delphi', '/payer-projects']

const getOtherUsersOnTool = (otherUsersTrackedData, currentPathname) => {
  const currentToolPath = TOOL_PATHS.find(toolPath => currentPathname.includes(toolPath))

  return otherUsersTrackedData.filter(({ pathname }) => pathname.includes(currentToolPath))
}
