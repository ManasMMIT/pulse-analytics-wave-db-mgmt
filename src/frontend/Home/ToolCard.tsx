import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Icon from '../components/Icon/index'
import { Colors, Spacing } from '../utils/pulseStyles'

const ICON_SIZE = 30

const StyledLink = styled(Link)((props: any) => ({
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

const IconWrapper = styled('div')((props: any) => ({
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
    ...props.style,
  }),
)

const getStyle = (activeColor: string): { background: string, opacity: number } => ({
  background: transparentize(0.8, activeColor),
  opacity: 1,
})

const ToolCard = (props: {
  title: string
  description: string
  iconId: string
  to: string
  iconColor: string
}) => {
  const { title, description, iconId, to, iconColor } = props

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
