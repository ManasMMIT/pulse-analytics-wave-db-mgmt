import React from "react"
import styled from '@emotion/styled'
import { useAuth0 } from "../react-auth0-spa"

const Avatar = styled.img({
  clipPath: `circle(20px at center)`,
  width: 40,
}, ({ style }) => style)

const UserProfile = ({ user, style }) => {
  const { loading, user: currentUser } = useAuth0()

  if (loading || !currentUser) return null

  let finalUser = user || currentUser

  return (
    <Avatar
      style={style}
      src={finalUser.picture}
      alt="Profile"
      title={finalUser.name}
    />
  )
}

export default UserProfile;
