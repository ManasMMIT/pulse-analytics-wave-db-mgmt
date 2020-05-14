import React from 'react'
import PropTypes from 'prop-types'

import { Colors } from '../utils/pulseStyles'

// credit for spinner: https://github.com/jxnblk/loading

const Spinner = ({ fill, size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size} fill={fill}>
    <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4" />
    <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
      <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />
    </path>
  </svg>
)

Spinner.propTypes = {
  fill: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}

Spinner.defaultProps = {
  fill: Colors.PRIMARY,
  size: "16",
}

export default Spinner
