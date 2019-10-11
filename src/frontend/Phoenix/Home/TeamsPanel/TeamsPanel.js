import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import Panel from '../../shared/Panel'
import CreateButton from './CreateButton'
import UpdateButton from './UpdateButton'
import DeleteButton from './DeleteButton'
import SitemapButton from '../../shared/SitemapButton'

import { SELECT_TEAM } from '../../../api/mutations'

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
  if (team.isDefault) return <SitemapButton teamId={team._id} />

  return (
    <>
      <UpdateButton team={team} />
      <SitemapButton teamId={team._id} />
      <DeleteButton teamId={team._id} />
    </>
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

const TeamsPanel = () => {
  const { data, loading, error } = useQuery(GET_SELECTED_CLIENT)
  if (loading) return null
  if (error) return <div>Error fetching data</div>

  const { selectedClient: { description: clientName } } = data

  return (
    <Panel
      style={{ backgroundColor: '#edf1f5' }}
      title={`Teams for ${clientName}`}
      titleStyle={{ color: '#536f8d' }}
      headerChildren={headerChildren}
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
