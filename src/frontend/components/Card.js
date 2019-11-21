import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors, Spacing } from '../utils/pulseStyles'

const Wrapper = styled.div({
  margin: Spacing.NORMAL,
  backgroundColor: Colors.WHITE,
  borderRadius: 4,
})

const Header = styled.div({
  fontSize: 14,
  fontWeight: 700,
  padding: `${Spacing.NORMAL} ${Spacing.EXTRA_LARGE}`,
  textTransform: 'uppercase',
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
})

const Body = styled.div({
  padding: Spacing.EXTRA_LARGE,
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

Card.propTypes = {
  title: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}

export default Card
