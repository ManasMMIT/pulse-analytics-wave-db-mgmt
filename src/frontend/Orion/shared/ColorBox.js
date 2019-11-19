import React from 'react'
import PropTypes from 'prop-types'

import { Colors, Spacing } from '../../utils/pulseStyles'

const defaultStyle = {
  padding: Spacing.SMALL,
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 700,
  color: Colors.WHITE,
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
