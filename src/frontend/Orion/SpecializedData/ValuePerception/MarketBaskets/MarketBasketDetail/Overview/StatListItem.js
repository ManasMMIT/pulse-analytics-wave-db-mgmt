import React from 'react'
import styled from '@emotion/styled'

const Title = styled.span({
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '20px',
})

const StatListItem = ({ title, description }) => {
  return (
    <div style={{ padding: 12 }}>
      <Title>{title}</Title>
      <p>{description}</p>
    </div>
  )
}

export default StatListItem
