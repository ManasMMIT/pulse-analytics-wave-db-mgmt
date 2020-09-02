import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Icon from 'frontend/components/Icon'
import { Colors, Spacing } from 'frontend/utils/pulseStyles'

const ICON_SIZE = 30

const StyledLink = styled(Link)((props) => ({
  display: 'flex',
  padding: 12,
  margin: 12,
  background: Colors.WHITE,
  borderRadius: 4,
  width: '33%',
  justifyContent: 'space-between',
  alignItems: 'center',
  ':hover': {
    boxShadow: `0 0 0 2px ${props.color}`,
  },
  ':active': {
    boxShadow: `0 0 0 6px ${transparentize(0.5, props.color)}`,
  },
}))

const IconWrapper = styled('div')(
  {
    width: 'fit-content',
    height: 'fit-content',
    color: Colors.WHITE,
    borderRadius: 4,
    textDecoration: 'none',
    padding: `${Spacing.NORMAL} ${Spacing.NORMAL} ${Spacing.SMALL}`,
    margin: Spacing.TINY,
    opacity: 0.6,
    ':hover': {
      background: transparentize(0.92, Colors.WHITE),
    },
  },
  ({ style }) => ({ ...style })
)

const getStyle = (activeColor) => ({
  background: transparentize(0.8, activeColor),
  opacity: 1,
})

const ToolCard = ({ title, description, iconId, to, iconColor }) => {
  return (
    <StyledLink to={to} color={iconColor}>
      <div>
        <div
          style={{
            color: iconColor,
            fontWeight: 700,
            fontSize: 16,
            paddingBottom: 4,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 12 }}>{description}</div>
      </div>
      <IconWrapper style={getStyle(iconColor)}>
        <Icon
          color1={iconColor}
          width={ICON_SIZE}
          height={ICON_SIZE}
          iconName={iconId}
        />
      </IconWrapper>
    </StyledLink>
  )
}

export default ToolCard
