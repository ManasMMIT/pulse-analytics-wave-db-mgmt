import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import SVG from 'react-inlinesvg'

const IconContainer = styled.span(({ height, width, color1, color2, style }) => ({
  height,
  width,
  ...style,
  '& svg': {
    height: 'inherit',
    width: 'inherit',
    '& .icon-color-1': { fill: color1 },
    '& .icon-color-2': { fill: color2 },
  }
}))

const Icon = ({
  iconName,
  color1,
  color2,
  height,
  width,
  style,
}) => {
  const src = `https://res.cloudinary.com/pulsedatatools/polaris/icons/${iconName}.svg`

  return (
    <IconContainer
      color1={color1}
      color2={color2}
      height={height}
      width={width}
      style={style}
    >
      <SVG
        viewBox="0 0 24 24"
        src={src}
      />
    </IconContainer>
  )
}

Icon.propTypes = {
  iconName: PropTypes.string.isRequired,
  color1: PropTypes.string,
  color2: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  style: PropTypes.object,
}

Icon.defaultProps = {
  color1: null,
  color2: null,
  height: 24,
  width: 24,
  style: {},
}

export default Icon