import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const Wrapper = styled.div(({ isSelected }) => ({
  cursor: isSelected ? 'default' : 'pointer',
  backgroundColor: isSelected ? '#f8fafb' : 'none',
  padding: 24,
  color: isSelected ? '#2a7ad3' : '#838c96',
  borderLeft: isSelected ? '4px solid #1f6cc7' : '4px solid transparent',
}))

const Team = ({
  onClick,
  team,
  isSelected,
}) => {
  return (
    <Wrapper
      onClick={() => onClick(team.id)}
      isSelected={isSelected}
    >
      {team.description}
    </Wrapper>
  )
}

Team.defaultProps = {
  team: { name: null },
}

Team.propTypes = {
  onClick: PropTypes.func.isRequired,
  team: PropTypes.object,
  isSelected: PropTypes.bool.isRequired,
}

export default Team
