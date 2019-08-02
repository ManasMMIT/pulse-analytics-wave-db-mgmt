import React from 'react'
import { Query } from 'react-apollo'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import Panel from './shared/Panel'
import TextFormButton from './shared/TextForm/Button'
import DeleteButton from './shared/DeleteButton'

import {
  CREATE_TEAM,
  SELECT_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM,
} from '../api/mutations'

import {
  GET_SELECTED_CLIENT,
  GET_CLIENT_TEAMS,
  GET_SELECTED_TEAM,
} from '../api/queries'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const createButtonStyle = {
  background: '#d4e2f2',
  color: '#1d66b8',
}

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

const buttonGroupCallback = team => {
  if (team.isDefault) return null

  return (
    <>
      <TextFormButton
        modalTitle="Edit Team"
        buttonLabel={editIcon}
        buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
        data={{ description: team.description }}
        mutationDoc={UPDATE_TEAM}
      />

      <DeleteButton
        itemId={team.id}
        mutationDoc={DELETE_TEAM}
      />
    </>
  )
}

const panelItemConfig = {
  selectEntityMutationDoc: SELECT_TEAM,
  style: defaultPanelItemStyle,
  activeStyle: activePanelItemStyle,
  buttonGroupCallback,
  // ! Note: inactiveStyle not needed until hover effects differ
  // ! between active and inactive states
  // inactiveStyle: inactivePanelItemStyle,
}

const createButton = (
  <TextFormButton
    modalTitle="Create Team"
    buttonLabel="Create Team"
    buttonStyle={createButtonStyle}
    mutationDoc={CREATE_TEAM}
  />
)

const TeamsPanel = () => (
  <Query query={GET_SELECTED_CLIENT}>
    {({ data: { selectedClient: { description: clientName }} }) => (
      <Panel
        style={{ backgroundColor: '#edf1f5' }}
        title={`Teams for ${clientName}`}
        titleStyle={{ color: '#536f8d' }}
        createButton={createButton}
        queryDocs={{
          fetchAllEntities: GET_CLIENT_TEAMS,
          fetchSelectedEntity: GET_SELECTED_TEAM,
        }}
        panelItemConfig={panelItemConfig}
        buttonGroupCallback={buttonGroupCallback}
      />
    )}
  </Query>
)

export default TeamsPanel
