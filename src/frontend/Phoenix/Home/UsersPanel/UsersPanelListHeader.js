import React from 'react'
import styled from '@emotion/styled'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import PropTypes from 'prop-types'

import Color from 'frontend/utils/color'

import CreateButton from './CreateButton'

const Header = styled.div({
  backgroundColor: '#f7f9fa',
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
  color: Color.BLACK,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.2px',
  padding: 24,
  textTransform: 'uppercase',
})

const UsersPanelListHeader = ({ title, handleClick }) => {
  const location = useLocation()

  const { teamId: selectedTeamId } =
    (location.search && queryString.parse(location.search)) || {}

  const usersTitle = `Users for ${title}`
  const isTeamAllUsers = selectedTeamId === 'allUsers'

  return (
    <Header>
      <Title>{usersTitle}</Title>
      <div style={{ paddingRight: 24 }}>
        {!isTeamAllUsers && <CreateButton handleClick={handleClick} />}
      </div>
    </Header>
  )
}

UsersPanelListHeader.propTypes = {
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default UsersPanelListHeader
