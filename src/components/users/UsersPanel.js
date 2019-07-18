import React from 'react'
import PropTypes from 'prop-types'

import User from './User'

const UsersPanel = ({ users }) => (
  <div style={{ flex: 2, backgroundColor: '#f7f9fa' }}>
    <h1>Users</h1>
    <div>{
      users.map(user => <User key={user.id} user={user} />)
    }</div>
  </div>
)

UsersPanel.defaultProps = {
  users: [],
}

UsersPanel.propTypes = {
  users: PropTypes.array,
}

export default UsersPanel