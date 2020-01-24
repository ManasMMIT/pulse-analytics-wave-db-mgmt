import React from "react"
import { useAuth0 } from "../react-auth0-spa"

const UserProfile = () => {
  const { loading, user } = useAuth0()

  if (loading || !user) return null

  return (
    <img 
      src={user.picture} 
      style={{ width: 30 }} 
      alt="Profile"
      title={user.name}
    />
  )
}

export default UserProfile;
