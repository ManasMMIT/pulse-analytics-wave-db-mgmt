import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Query } from 'react-apollo'

import { faEdit } from "@fortawesome/free-solid-svg-icons"

import Panel from '../../shared/Panel'
import UserFormButton from './UserForm/Button'
import DeleteButton from '../../shared/DeleteButton'

import {
  SELECT_USER,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
} from '../../../api/mutations'

import {
  GET_TEAM_USERS,
  GET_SELECTED_USER,
  GET_SELECTED_TEAM,
} from '../../../api/queries'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const defaultPanelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#838c96',
  borderLeft: '4px solid transparent',
  padding: 24,
}

const activePanelItemStyle = {
  cursor: 'default',
  backgroundColor: '#f8fafb',
  color: '#2a7ad3',
  borderLeft: '4px solid #1f6cc7',
}

const buttonGroupCallback = user => {
  if (user.isDefault) return null

  return (
    <>
      <UserFormButton
        modalTitle="Edit User"
        buttonLabel={editIcon}
        buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
        userId={user._id}
        username={user.username}
        email={user.email}
        mutationDoc={UPDATE_USER}
      />

      <DeleteButton
        itemId={user._id}
        mutationDoc={DELETE_USER}
      />
    </>
  )
}

const panelItemConfig = {
  selectEntityMutationDoc: SELECT_USER,
  style: defaultPanelItemStyle,
  activeStyle: activePanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ username }) => username,
  // ! Note: inactiveStyle not needed until hover effects differ
  // ! between active and inactive states
  // inactiveStyle: inactivePanelItemStyle,
}

const panelStyle = {
  flex: 4,
  backgroundColor: '#f7f9fa',
  minHeight: 'calc(100vh - 37px)',
  maxHeight: 'calc(100vh - 37px)',
}

const UsersTab = () => (
  <Query query={GET_SELECTED_TEAM}>
    {
      ({ data: { selectedTeam } }) => {

        const headerChildren = (
          <UserFormButton
            modalTitle="Create User"
            buttonLabel="Create User"
            buttonStyle={{ background: '#d4e2f2', color: '#1d66b8' }}
            selectedTeamId={selectedTeam._id}
            mutationDoc={CREATE_USER}
          />
        )

        return (
          <Panel
            style={panelStyle}
            title={`Users for ${selectedTeam.description}`}
            headerChildren={headerChildren}
            queryDocs={{
              fetchAllQueryProps: { query: GET_TEAM_USERS },
              fetchSelectedQueryProps: { query: GET_SELECTED_USER },
            }}
            panelItemConfig={panelItemConfig}
          />
        )
      }
    }
  </Query>
)

export default UsersTab
