import React from 'react'
import { transparentize } from 'polished'
import styled from '@emotion/styled'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import PropTypes from 'prop-types'

import { GET_USER_TEAMS } from 'frontend/api/queries'

import { Colors } from 'frontend/utils/pulseStyles'

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
  padding: '8px 24px',
  borderBottom: `1px solid ${transparentize(0.92, Colors.BLACK)}`,
}

const activePanelItemStyle = {
  cursor: 'default',
  backgroundColor: Colors.WHITE,
  color: Colors.PRIMARY,
  borderLeft: `4px solid ${Colors.PRIMARY}`,
}

const teamBoxStyle = {
  margin: '0px 4px',
  background: transparentize(0.85, Colors.MEDIUM_GRAY_2),
  borderRadius: 2,
  color: Colors.MEDIUM_GRAY_2,
  fontSize: '10px',
  fontWeight: 500,
  lineHeight: '16px',
  padding: '2px 4px',
}

const lockedDefaultPathStyle = {
  ...teamBoxStyle,
  color: Colors.WHITE,
  background: transparentize(0.5, Colors.TOOL_SIDEBAR),
  padding: '1px 2px',
}

const Wrapper = styled.div(DEFAULT_WRAPPER_STYLE, ({ style }) => ({
  ...style,
}))

const UserTeamsLabel = ({ userId }) => {
  const { data, loading, error } = useQuery(GET_USER_TEAMS, {
    variables: { userId },
  })

  if (loading) return 'Loading...'
  if (error) return 'Error!'

  const { teams } = data

  if (teams.length === 0)
    return (
      <span style={{ ...teamBoxStyle, color: Colors.RED }}>{'No Teams'}</span>
    )

  const teamNames = teams.map(({ _id, description }) => (
    <span key={_id} style={teamBoxStyle}>
      {description}
    </span>
  ))

  return teamNames
}

const getLabel1 = ({ username, defaultLanding }) => {
  return (
    <>
      <span>{username}</span>
      {!_.isEmpty(defaultLanding) && defaultLanding.locked && (
        <span style={lockedDefaultPathStyle}>PL</span>
      )}
    </>
  )
}

const getLabel2 = ({ _id }) => <UserTeamsLabel userId={_id} />

const UsersPanelListItem = ({
  data,
  isSelected,
  handleClick,
  searchParamKey,
}) => {
  const listItemHandleClick = isSelected
    ? () => null
    : () => handleClick(data[searchParamKey])

  const getButtonGroup = (user) => {
    if (user.isDefault) return null

    return (
      <div style={{ display: 'flex' }}>
        <UpdateButton userData={user} />
        <DeleteButton userId={user._id} handleClick={handleClick} />
      </div>
    )
  }

  const style = isSelected ? activePanelItemStyle : {}

  return (
    <Wrapper onClick={listItemHandleClick} style={style}>
      <div>
        <div>{getLabel1(data)}</div>
        <div style={{ fontWeight: 300, fontStyle: 'italic' }}>
          {getLabel2(data)}
        </div>
      </div>

      <div>{getButtonGroup(data)}</div>
    </Wrapper>
  )
}

UsersPanelListItem.propTypes = {
  data: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  searchParamKey: PropTypes.string.isRequired,
}

export default UsersPanelListItem
