import React from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled";

import PanelItem from './../PanelItem'

const Title = styled.div({
  fontWeight: 700,
  fontSize: 24,
  padding: 24,
})

const UsersPanel = ({
  users,
  teamName,
  handlers,
  selectedUser,
}) => {

  return (
    <div style={{ flex: 2, backgroundColor: '#f7f9fa' }}>
      <Title>Users</Title>
      <div>{
        users.map(user => {
          const style = {
            padding: 24,
          }

          return (
            <PanelItem
              key={user.id}
              style={style}
              handlers={handlers}
              item={user}
              text={user.username}
            />
          )
        })
      }</div>
    </div>
  )
}

UsersPanel.defaultProps = {
  users: [],
}

UsersPanel.propTypes = {
  users: PropTypes.array,
  teamName: PropTypes.string,
  handlers: PropTypes.object,
  selectedUser: PropTypes.string,
};

export default UsersPanel