import React from 'react'
import styled from '@emotion/styled'

import ButtonGroup from '../shared/ButtonGroup'
import { panelItemStyle, panelItemActiveStyle } from '../shared/panelStyles'

const Wrapper = styled.div(panelItemStyle)

const getDashboardsPanelListItem = (dashboardsStatus, handleToggle) => {
  const getLabel2 = ({ _id, name: sourceNodeName }) => {
    const teamNode = dashboardsStatus[_id]
    if (!teamNode) return null

    const teamNodeTitle = teamNode.text.title
    if (sourceNodeName === teamNodeTitle) return null

    return teamNodeTitle
  }

  const getButtonGroup = (dashboard) => (
    <ButtonGroup
      sourceEntity={dashboard}
      teamEntityNodes={dashboardsStatus}
      nodeType="dashboards"
      handleToggle={handleToggle}
    />
  )

  const DashboardsPanelListItem = ({
    data,
    isSelected,
    handleClick,
    searchParamKey,
  }) => {
    const listItemHandleClick = isSelected
      ? () => null
      : () => handleClick(data[searchParamKey])

    const style = isSelected ? panelItemActiveStyle : {}

    return (
      <Wrapper onClick={listItemHandleClick} style={style}>
        <div>
          <div>{data.name}</div>
          <div style={{ fontWeight: 300, fontStyle: 'italic' }}>
            {getLabel2(data)}
          </div>
        </div>

        <div>{getButtonGroup(data)}</div>
      </Wrapper>
    )
  }

  return DashboardsPanelListItem
}

export default getDashboardsPanelListItem
