import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors, Spacing } from '../../utils/pulseStyles'

const StyledNavLink = styled(NavLink)({
  margin: `0 ${Spacing.NORMAL}`,
  borderRadius: 4,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  textDecoration: 'none',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: '20px',
  ':hover': {
    background: transparentize(0.9, Colors.WHITE),
  },
})

const defaultInactiveStyle = {
  color: transparentize(0.4, Colors.WHITE),
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
}

const defaultActiveStyle = {
  color: Colors.WHITE,
  background: transparentize(0.9, Colors.WHITE),
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
}

const NavigationLink = ({ link, label, activeStyle, style }) => {
  const combinedActiveStyle = { ...defaultActiveStyle, ...activeStyle }
  const combinedStyle = { ...defaultInactiveStyle, ...style }

  return (
    <StyledNavLink
      to={link}
      activeStyle={combinedActiveStyle}
      style={combinedStyle}
    >
      {label}
    </StyledNavLink>
  )
}

NavigationLink.propTypes = {
  link: PropTypes.string,
  label: PropTypes.string,
  activeStyle: PropTypes.object,
  style: PropTypes.object,
}

NavigationLink.defaultProps = {
  label: '',
  link: null,
  activeStyle: {},
  style: {},
}

export default NavigationLink
