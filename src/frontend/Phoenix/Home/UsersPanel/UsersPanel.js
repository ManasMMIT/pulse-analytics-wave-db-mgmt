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

import { Colors } from '../../../utils/pulseStyles'

const defaultPanelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  color: Colors.BLACK,
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.2px',
  lineHeight: '22px',
  borderLeft: '4px solid transparent',
  padding: '8px 24px',
  borderBottom: `1px solid ${transparentize(0.92, Colors.BLACK)}`
}

const activePanelItemStyle = {
  cursor: 'default',
  backgroundColor: Colors.WHITE,
  color: Colors.PRIMARY,
  borderLeft: `4px solid ${Colors.PRIMARY}`,
}

const buttonGroupCallback = user => {
  if (user.isDefault) return null

  return (
    <div style={{ display: 'flex' }}>
      <UpdateButton userData={user} />
      <DeleteButton userId={user._id} />
    </div>
  )
}

const teamBoxStyle = {
  margin: '0px 4px',
  background: transparentize(0.85, Colors.MEDIUM_GRAY_2),
  borderRadius: 2,
  color: Colors.MEDIUM_GRAY_2,
  fontSize: '10px',
  fontWeight: 500,
  lineHeight: '16px',
  padding: '2px 4px',
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
    <span key={_id} style={teamBoxStyle}>
      {description}
    </span>
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

const panelBackgroundColor = '#f7f9fa'

const panelStyle = {
  backgroundColor: panelBackgroundColor,
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
      headerContainerStyle={{ backgroundColor: panelBackgroundColor }}
      queryDocs={{
        fetchAllQueryProps: { query: GET_TEAM_USERS },
        fetchSelectedQueryProps: { query: GET_SELECTED_USER },
      }}
      panelItemConfig={panelItemConfig}
    />
  )
}

export default UsersPanel
