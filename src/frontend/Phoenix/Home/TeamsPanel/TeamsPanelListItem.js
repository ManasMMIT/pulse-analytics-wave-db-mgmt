import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { Colors } from 'frontend/utils/pulseStyles'

import SitemapButton from '../../shared/SitemapButton'
import UpdateButton from './UpdateButton'
import DeleteButton from './DeleteButton'

const DEFAULT_WRAPPER_STYLE = {
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

const Wrapper = styled.div(DEFAULT_WRAPPER_STYLE, ({ style }) => ({
  ...style,
}))

const TeamsPanelListItem = ({
  data,
  isSelected,
  handleClick,
  searchParamKey,
}) => {
  const listItemHandleClick = isSelected
    ? () => null
    : () => handleClick(data[searchParamKey])

  const getButtonGroup = (team) => {
    if (team._id === 'allUsers') return null
    if (team.isDefault) return <SitemapButton teamId={team._id} />

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <UpdateButton
          team={team}
          handleClick={handleClick}
          searchParamKey={searchParamKey}
        />
        <SitemapButton teamId={team._id} />
        <DeleteButton
          teamId={team._id}
          handleClick={handleClick}
          searchParamKey={searchParamKey}
        />
      </div>
    )
  }

  const style = isSelected ? activePanelItemStyle : {}

  return (
    <Wrapper onClick={listItemHandleClick} style={style}>
      <div>
        <div>{data.description}</div>
      </div>

      <div>{getButtonGroup(data)}</div>
    </Wrapper>
  )
}

TeamsPanelListItem.propTypes = {
  data: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  searchParamKey: PropTypes.string.isRequired,
}

export default TeamsPanelListItem
