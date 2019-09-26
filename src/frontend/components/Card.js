import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const Wrapper = styled.div({
  margin: 12,
  backgroundColor: 'white',
  borderRadius: 2,
})

const Header = styled.div({
  fontSize: 18,
  fontWeight: 700,
  padding: 24,
  borderBottom: '1px solid rgba(194, 196, 212, 0.2)',
})

const Body = styled.div({
  padding: 24,
})

const Card = ({
  title,
  width,
  children,
}) => (
  <Wrapper style={{ width }}>
    {title && (
      <Header>
        {title}
      </Header>
    )}
    <Body>
      {children}
    </Body>
  </Wrapper>
)

export default Card
