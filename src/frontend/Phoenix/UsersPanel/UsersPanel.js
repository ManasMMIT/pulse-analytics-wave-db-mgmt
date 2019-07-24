import React from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled";

import UserFormButton from './UserFormButton'
import UserForm from '../../components/forms/UserForm'
import PanelItem from '../shared/PanelItem'

const Title = styled.div({
  fontWeight: 700,
  fontSize: 24,
  padding: 24,
})

const UsersPanel = ({
  users,
  teamName,
  teams,
  selectedTeam,
  selectedClient,
  handlers,
  selectedUser,
}) => {
  return (
    <div style={{ flex: 2, backgroundColor: '#f7f9fa' }}>
      <Title>Users</Title>

      <UserFormButton
        handleSubmit={handlers.createHandler}
        selectedTeam={selectedTeam}
        selectedClient={selectedClient}
        teams={teams}
      />

      <div>{
        users.map(user => {
          const style = {
            padding: 24,
          }

          const userFormNode = (
            <UserForm
              userId={user.id}
              username={user.username}
              email={user.email}
              selectedTeam={selectedTeam}
              allTeamsUserIsOn={user.roles}
              teams={teams}
              handleSubmit={handlers.editHandler}
            />
          )

          return (
            <PanelItem
              key={user.id}
              style={style}
              handlers={handlers}
              item={user}
              text={user.username}
              editForm={userFormNode}
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
