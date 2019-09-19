import React from 'react'
import PropTypes from 'prop-types'

const defaultStyle = {
  height: 12,
  width: 12,
  margin: 12,
  padding: 12,
  color: 'white',
  textAlign: 'center',
}

const ColorBox = ({
  label,
  boxColor,
  style,
}) => (
  <div style={{ ...defaultStyle, ...style, backgroundColor: boxColor }}>
    {label}
  </div>
)

ColorBox.propTypes = {
  label: PropTypes.any,
  boxColor: PropTypes.string,
  style: PropTypes.object,
}

ColorBox.defaultProps = {
  label: '   ',
  boxColor: 'grey',
  style: {},
}

export default ColorBox
