import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'

import DashboardToolPanelItem from './DashboardToolPanelItem'

import {
  ListContainer,
  ListHeader,
  ListTitle,
  StyledUnorderedList,
} from './../shared/styledComponents'

const DASHBOARD_TOOL_LABEL = 'Dashboard Tool'

const DASHBOARD_TOOLS = [
  {
    dashboardTool: 'obm_accounts',
    dashboardToolLabel: 'OBM Accounts',
  },
  {
    dashboardTool: 'pathways_apm',
    dashboardToolLabel: 'Pathways APM',
  },
  {
    dashboardTool: 'payer',
    dashboardToolLabel: 'Payer',
  },
  {
    dashboardTool: 'provider_immuno-oncology',
    dashboardToolLabel: 'Provider Immuno Oncology',
  },
  {
    dashboardTool: 'provider_key-accounts',
    dashboardToolLabel: 'Provider Key Accounts',
  },
  {
    dashboardTool: 'provider_sickle-cell',
    dashboardToolLabel: 'Provider Sickle Cell',
  },
]

const DashboardToolPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const selectedDashboardTool =
    (location.search &&
      queryString.parse(location.search) &&
      queryString.parse(location.search).dashboardTool) ||
    ''

  const handleClick = ({ dashboardTool }) => {
    history.push({
      search: queryString.stringify({ dashboardTool }),
    })
  }

  if (!selectedDashboardTool) {
    const firstDashboardTool = DASHBOARD_TOOLS[0]

    handleClick(firstDashboardTool)
  }

  return (
    <ListContainer style={{ flex: 1 }}>
      <ListHeader>
        <ListTitle>{DASHBOARD_TOOL_LABEL}</ListTitle>
      </ListHeader>

      <StyledUnorderedList>
        {DASHBOARD_TOOLS.map((dashboardTool) => (
          <DashboardToolPanelItem
            key={dashboardTool.dashboardTool}
            isSelected={dashboardTool.dashboardTool === selectedDashboardTool}
            handleClick={() => handleClick(dashboardTool)}
            dashboardToolLabel={dashboardTool.dashboardToolLabel}
          />
        ))}
      </StyledUnorderedList>
    </ListContainer>
  )
}

export default DashboardToolPanel
