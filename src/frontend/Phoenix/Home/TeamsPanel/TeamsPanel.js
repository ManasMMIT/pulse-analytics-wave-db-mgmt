import React from 'react'
import { useQuery } from '@apollo/client'

import Panel from '../../../components/Panel'
import CreateButton from './CreateButton'
import UpdateButton from './UpdateButton'
import DeleteButton from './DeleteButton'
import SitemapButton from '../../shared/SitemapButton'

import { SELECT_TEAM } from '../../../api/mutations'
import { Colors } from '../../../utils/pulseStyles'

import {
  GET_SELECTED_CLIENT,
  GET_CLIENT_TEAMS,
  GET_SELECTED_TEAM,
} from '../../../api/queries'

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
  padding: '12px 24px',
}

const activePanelItemStyle = {
  cursor: 'default',
  backgroundColor: '#f8fafb',
  color: Colors.PRIMARY,
  borderLeft: `4px solid ${Colors.PRIMARY}`,
}

const buttonGroupCallback = (team) => {
  if (team.isDefault) return <SitemapButton teamId={team._id} />

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <UpdateButton team={team} />
      <SitemapButton teamId={team._id} />
      <DeleteButton teamId={team._id} />
    </div>
  )
}

const panelItemConfig = {
  selectEntityMutationDoc: SELECT_TEAM,
  style: defaultPanelItemStyle,
  activeStyle: activePanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ description }) => description,
  // ! Note: inactiveStyle not needed until hover effects differ
  // ! between active and inactive states
  // inactiveStyle: inactivePanelItemStyle,
}

const headerChildren = <CreateButton />

const panelBackgroundColor = '#edf1f5'

const TeamsPanel = () => {
  const { data, loading, error } = useQuery(GET_SELECTED_CLIENT)
  if (loading) return null
  if (error) return <div>Error fetching data</div>

  const {
    selectedClient: { description: clientName },
  } = data

  return (
    <Panel
      style={{ backgroundColor: panelBackgroundColor }}
      title={`Teams for ${clientName}`}
      titleStyle={{ color: '#536f8d' }}
      headerChildren={headerChildren}
      headerContainerStyle={{ backgroundColor: panelBackgroundColor }}
      queryDocs={{
        fetchAllQueryProps: { query: GET_CLIENT_TEAMS },
        fetchSelectedQueryProps: { query: GET_SELECTED_TEAM },
      }}
      panelItemConfig={panelItemConfig}
      buttonGroupCallback={buttonGroupCallback}
    />
  )
}

export default TeamsPanel
