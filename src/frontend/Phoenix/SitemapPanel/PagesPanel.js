import React from 'react'
import { useQuery } from '@apollo/client'

import {
  GET_DASHBOARD_PAGES,
  GET_SELECTED_PAGE,
  GET_SELECTED_DASHBOARD,
} from '../../api/queries'

import { SELECT_PAGE } from '../../api/mutations'

import Panel from '../../components/Panel'
import ButtonGroup from './shared/ButtonGroup'

import {
  panelItemStyle,
  panelItemActiveStyle,
  panelHeaderStyle,
  panelTitleStyle,
  defaultPanelStyle,
} from './shared/panelStyles'

const PagesPanel = ({
  handleToggle,
  pagesStatus,
}) => {
  const { data, loading } = useQuery(GET_SELECTED_DASHBOARD)

  if (loading) return null

  let dashboardName = ''
  if (data.selectedDashboard) {
    dashboardName = data.selectedDashboard.name
  }

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
      titleStyle={panelTitleStyle}
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
