import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { transparentize } from 'polished'

import Panel from '../../shared/Panel'
import CreateButton from './CreateButton'
import UpdateButton from './UpdateButton'
import DeleteButton from './DeleteButton'

import {
  SELECT_USER,
} from '../../../api/mutations'

import {
  GET_TEAM_USERS,
  GET_SELECTED_USER,
  GET_SELECTED_TEAM,
  GET_USER_TEAMS,
} from '../../../api/queries'

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
      <UpdateButton userData={user} />
      <DeleteButton userId={user._id} />
    </>
  )
}

const teamBoxStyle = {
  margin: '0px 3px',
  background: '#F6F8F9',
  borderRadius: '3px',
  color: transparentize(0.7, '#0E2539'),
  fontSize: '10px',
  fontWeight: 700,
  padding: '4px 8px',
}

const UserTeamsLabel = ({ userId }) => {
  const { data, loading, error } = useQuery(
    GET_USER_TEAMS,
    { variables: { userId } }
  )

  if (loading) return 'Loading...'
  if (error) return 'Error!'

  const { teams } = data

  const teamNames = teams.map(({ _id, description }) =>
    <div key={_id} style={teamBoxStyle}>
      {description}
    </div>
  )

  return teamNames
}

const panelItemConfig = {
  selectEntityMutationDoc: SELECT_USER,
  style: defaultPanelItemStyle,
  activeStyle: activePanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ username }) => username,
  label2Callback: ({ _id }) => <UserTeamsLabel userId={_id} />,
  // ! Note: inactiveStyle not needed until hover effects differ
  // ! between active and inactive states
  // inactiveStyle: inactivePanelItemStyle,
}

const panelStyle = {
  backgroundColor: '#f7f9fa',
  height: '100vh',
}

const headerChildren = <CreateButton />

const UsersPanel = () => {
  const { data, loading, error } = useQuery(GET_SELECTED_TEAM)

  if (loading) return null
  if (error) return <div>{error}</div>

  const { selectedTeam } = data

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

export default UsersPanel
