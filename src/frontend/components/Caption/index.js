import React from 'react'
import PropTypes from 'prop-types'

import FontSpace from '../../utils/fontspace'
import Color from '../../utils/color'

const defaultStyle = {
  ...FontSpace.FS2,
  fontStyle: 'italic',
  color: Color.MEDIUM_GRAY_2,
}

const Caption = ({ children, style }) => (
  <p style={{ ...defaultStyle, ...style }}>{children}</p>
)

Caption.propTypes = {
  children: PropTypes.any.isRequired,
  style: PropTypes.object,
}

Caption.defaultProps = {
  style: {},
}

export default Caption
