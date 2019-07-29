import React from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import UserFormButton from './UserForm/Button'
import PanelItem from '../shared/PanelItem'
import DeleteButton from '../shared/DeleteButton'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

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
  // selectedUser,
}) => {
  return (
    <div style={{ flex: 2, backgroundColor: '#f7f9fa' }}>
      <Title>Users for {teamName}</Title>

      <UserFormButton
        buttonLabel={'Create User'}
        modalTitle={'Create User'}
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

          return (
            <PanelItem
              key={user.id}
              itemId={user.id}
              label={user.username}
              style={style}
              onClick={handlers.onClick}
            >
              <UserFormButton
                buttonLabel={editIcon}
                buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
                modalTitle={'Edit User'}
                userId={user.id}
                selectedClient={selectedClient}
                selectedTeam={selectedTeam}
                username={user.username}
                email={user.email}
                allTeamsUserIsOn={user.roles}
                teams={teams}
                handleSubmit={handlers.editHandler}
              />

              <DeleteButton
                itemId={user.id}
                deleteHandler={handlers.deleteHandler}
              />
            </PanelItem>
          )
        })
      }</div>
    </div>
  )
}

UsersPanel.propTypes = {
  users: PropTypes.array,
  teamName: PropTypes.string,
  teams: PropTypes.array,
  handlers: PropTypes.object,
  selectedClient: PropTypes.string,
  selectedTeam: PropTypes.string,
  // selectedUser: PropTypes.string,
}

UsersPanel.defaultProps = {
  users: [],
}

export default UsersPanel
