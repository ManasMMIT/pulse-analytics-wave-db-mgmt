import React from "react"
import styled from '@emotion/styled'
import { useAuth0 } from "../react-auth0-spa"

const Avatar = styled.img({
  clipPath: `circle(20px at center)`,
  width: 40,

})

const UserProfile = () => {
  const { loading, user } = useAuth0()

  if (loading || !user) return null

  return (
    <Avatar
      src={user.picture}
      alt="Profile"
      title={user.name}
    />
  )
}

export default UserProfile;
