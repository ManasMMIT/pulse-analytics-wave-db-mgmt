import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styled from '@emotion/styled'
import { transparentize, lighten, mix } from 'polished'

import Icon from '../Icon'

import Color from '../../utils/color'
import FontSpace from '../../utils/fontspace'
import Spacing from '../../utils/spacing'
import { Transitions } from '../../utils/pulseStyles'

// Shared Button Style
const baseButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${Spacing.S2} ${Spacing.S3}`,
  borderRadius: 4,
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  ...FontSpace.FS2,
}

// Primary Button Style
const getPrimaryButtonStyle = (color) => ({
  ...baseButtonStyle,
  background: color,
  color: Color.WHITE,
  transition: `background ${Transitions.NORMAL}`,
  ':hover': {
    background: lighten(0.1, color),
  },
  ':active': {
    background: mix(0.1, Color.BLACK, color),
  },
})

// Secondary Button Style
const getSecondaryButtonStyle = (color) => ({
  ...baseButtonStyle,
  background: transparentize(0.85, color),
  color: color,
  transition: `background ${Transitions.NORMAL}`,
  ':hover': {
    background: transparentize(0.65, color),
  },
  active: {
    background: transparentize(0.75, color),
  },
})

const StyledButton = styled.button(({ type, color, buttonStyle, hoverStyle }) => {
  const typeStyle =
    type === 'primary' ? getPrimaryButtonStyle(color) : getSecondaryButtonStyle(color)
  const combinedHoverStyle = {
    ...typeStyle[':hover'],
    ...hoverStyle,
  }

  return {
    ...typeStyle,
    ...buttonStyle,
    ':hover': {
      ...combinedHoverStyle,
    },
  }
})

const generateButtonContent = ({ iconName, iconPosition, iconColor1, iconColor2, children }) => {
  if (!iconName) return children

  const iconProps = {
    height: 16,
    width: 16,
    color1: iconColor1,
    color2: iconColor2,
  }

  if (children) {
    const iconStyle = iconPosition === 'left' ? { marginRight: 8 } : { marginLeft: 8 }

    const content = [
      <Icon key={`icon-${iconName}`} iconName={iconName} style={iconStyle} {...iconProps} />,
      children,
    ]

    return iconPosition === 'left' ? content : content.reverse()
  } else {
    return <Icon iconName={iconName} {...iconProps} />
  }
}

const Button = ({
  onClick,
  type,
  color,
  buttonStyle,
  hoverStyle,
  iconName,
  iconColor1,
  iconColor2,
  iconPosition,
  children,
}) => {
  const buttonContent = generateButtonContent({
    iconName,
    iconPosition,
    iconColor1,
    iconColor2,
    children,
  })

  const combinedButtonStyle = children
    ? buttonStyle
    : { ...buttonStyle, padding: '7px 8px', lineHeight: 'normal' }

  return (
    <StyledButton
      onClick={onClick}
      type={type}
      color={color}
      buttonStyle={combinedButtonStyle}
      hoverStyle={hoverStyle}
    >
      {buttonContent}
    </StyledButton>
  )
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['primary', 'secondary']),
  color: PropTypes.string,
  buttonStyle: PropTypes.object,
  hoverStyle: PropTypes.object,
  iconName: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  iconColor1: PropTypes.string,
  iconColor2: PropTypes.string,
}

Button.defaultProps = {
  type: 'primary',
  color: Color.BLUE,
  buttonStyle: {},
  hoverStyle: {},
  iconName: null,
  iconPosition: 'left',
  iconColor1: null,
  iconColor2: null,
}

export default Button
