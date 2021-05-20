import React from 'react'
import styled from '@emotion/styled'

import ButtonGroup from '../shared/ButtonGroup'
import { panelItemStyle, panelItemActiveStyle } from '../shared/panelStyles'

const Wrapper = styled.div(panelItemStyle)

const getCardsPanelListItem = (cardsStatus, handleToggle) => {
  const getLabel2 = ({ _id, name: sourceNodeName }) => {
    const teamNode = cardsStatus[_id]
    if (!teamNode) return null

    const teamNodeTitle = teamNode.text.title
    if (sourceNodeName === teamNodeTitle) return null

    return teamNodeTitle
  }

  const getButtonGroup = (card) => (
    <ButtonGroup
      sourceEntity={card}
      teamEntityNodes={cardsStatus}
      nodeType="cards"
      handleToggle={handleToggle}
    />
  )

  const CardsPanelListItem = ({
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

  return CardsPanelListItem
}

export default getCardsPanelListItem
