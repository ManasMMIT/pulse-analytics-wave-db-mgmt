import React from 'react'

import UserProfile from '../UserProfile'

const profileStyle = {
  clipPath: `circle(15px at center)`,
  width: 30,
  margin: 12,
}

const UsersSection = ({ title, users }) => {
  return <div>
    <div style={{ fontWeight: 700, fontSize: 12, margin: 6, opacity: 1 }}>
      {title}
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {users.map(({ user }) => {
        return (<UserProfile style={profileStyle} key={user.sub} user={user} />)
      })}
    </div>
  </div>
}

export default UsersSection
