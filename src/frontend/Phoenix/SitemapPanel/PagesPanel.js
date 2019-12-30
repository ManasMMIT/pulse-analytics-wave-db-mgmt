import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { transparentize } from 'polished'

import {
  GET_DASHBOARD_PAGES,
  GET_SELECTED_PAGE,
  GET_SELECTED_DASHBOARD,
} from '../../api/queries'

import { SELECT_PAGE } from '../../api/mutations'

import Panel from '../shared/Panel'
import ButtonGroup from './shared/ButtonGroup'

const defaultPanelStyle = {
  padding: 20,
}

const panelHeaderStyle = {
  color: '#0E2539',
  fontWeight: 600,
}

const panelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '17px 20px',
  color: '#0E2539',
  fontWeight: 600,
  fontSize: 12,
  backgroundColor: transparentize(0.95, '#0E2539'),
  marginTop: 10,
  cursor: 'pointer',
}

const panelItemActiveStyle = {
  backgroundColor: transparentize(0.9, '#0668D9'),
  color: '#0668D9',
}

const PagesPanel = ({
  handleToggle,
  pagesStatus,
}) => {
  const { data, loading } = useQuery(GET_SELECTED_DASHBOARD)

  if (loading) return null

  const { selectedDashboard: { name: dashboardName } } = data

  const buttonGroupCallback = page => (
    <ButtonGroup
      sourceEntity={page}
      teamEntityNodes={pagesStatus}
      nodeType="pages"
      handleToggle={handleToggle}
    />
  )

  const label2Callback = ({ _id, name: sourceNodeName }) => {
    const teamNode = pagesStatus[_id]
    if (!teamNode) return null

    const teamNodeTitle = teamNode.text.title
    if (sourceNodeName === teamNodeTitle) return null

    return teamNodeTitle
  }

  return (
    <Panel
      style={defaultPanelStyle}
      headerContainerStyle={panelHeaderStyle}
      title={`PAGES / ${dashboardName}`}
      titleStyle={{ fontSize: 16 }}
      queryDocs={{
        fetchAllQueryProps: { query: GET_DASHBOARD_PAGES },
        fetchSelectedQueryProps: { query: GET_SELECTED_PAGE },
      }}
      panelItemConfig={{
        selectEntityMutationDoc: SELECT_PAGE,
        style: panelItemStyle,
        activeStyle: panelItemActiveStyle,
        buttonGroupCallback,
        label1Callback: ({ name }) => name,
        label2Callback,
      }}
    />
  )
}

export default PagesPanel
