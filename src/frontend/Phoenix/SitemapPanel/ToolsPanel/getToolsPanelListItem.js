import React from 'react'
import styled from '@emotion/styled'

import ButtonGroup from '../shared/ButtonGroup'
import { panelItemStyle, panelItemActiveStyle } from '../shared/panelStyles'

const Wrapper = styled.div(panelItemStyle)

const getToolsPanelListItem = (toolsStatus, handleToggle) => {
  const getLabel2 = ({ _id, name: sourceNodeName }) => {
    const teamNode = toolsStatus[_id]
    if (!teamNode) return null

    const teamNodeTitle = teamNode.text.title
    if (sourceNodeName === teamNodeTitle) return null

    return teamNodeTitle
  }

  const getButtonGroup = (tool) => (
    <ButtonGroup
      sourceEntity={tool}
      teamEntityNodes={toolsStatus}
      nodeType="tools"
      handleToggle={handleToggle}
    />
  )

  const ToolsPanelListItem = ({
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

  return ToolsPanelListItem
}

export default getToolsPanelListItem
