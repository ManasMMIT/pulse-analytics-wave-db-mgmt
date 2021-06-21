import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

import CreateButton from './CreateButton'

const Header = styled.div({
  backgroundColor: '#edf1f5',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 700,
  position: 'sticky',
  top: 0,
  width: '100%',
  zIndex: 100, // ! should be sourced from centralized style-guide file in the future
})

const Title = styled.div({
  color: '#536f8d',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.2px',
  padding: 24,
  textTransform: 'uppercase',
})

const TeamsPanelListHeader = ({ title, handleClick }) => {
  const teamsTitle = `Teams for ${title}`

  return (
    <Header>
      <Title>{teamsTitle}</Title>
      <div style={{ paddingRight: 24 }}>
        <CreateButton handleClick={handleClick} />
      </div>
    </Header>
  )
}

TeamsPanelListHeader.propTypes = {
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default TeamsPanelListHeader
