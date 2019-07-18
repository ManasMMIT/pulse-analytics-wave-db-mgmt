import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const Wrapper = styled.div(({ isSelected }) => ({
  cursor: isSelected ? 'default' : 'pointer',
  backgroundColor: isSelected ? '#1c4161' : 'none',
  padding: 24,
  color: isSelected ? '#ebf6fb' : '#7a97b1',
  borderLeft: isSelected ? '4px solid #0f66d0' : '4px solid transparent',
}))

const Client = ({
  onClick,
  client,
  isSelected,
}) => {
  return (
    <Wrapper
      onClick={() => onClick(client.id)}
      isSelected={isSelected}
    >
      {client.name}
    </Wrapper>
  )
}

Client.defaultProps = {
  client: { name: null },
}

Client.propTypes = {
  onClick: PropTypes.func.isRequired,
  client: PropTypes.object,
  isSelected: PropTypes.bool.isRequired,
}

export default Client
