import React from 'react'
import PropTypes from 'prop-types'

const User = ({ user }) => {
  return <div>{user.username}</div>
}

User.defaultProps = {
  user: { name: null },
}

User.propTypes = {
  user: PropTypes.object,
}

export default User
