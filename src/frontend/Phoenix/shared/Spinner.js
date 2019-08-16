import React from 'react'
import PropTypes from 'prop-types'

// credit for spinner: https://github.com/jxnblk/loading

const Spinner = ({ fill }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill={fill}>
    <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4" />
    <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
      <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />
    </path>
  </svg>
)

Spinner.propTypes = {
  fill: PropTypes.string,
}

Spinner.defaultProps = {
  fill: 'black',
}

export default Spinner
