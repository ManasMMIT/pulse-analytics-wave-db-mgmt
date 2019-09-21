import React from 'react'
import PropTypes from 'prop-types'

const ValidationError = ({
  error,
}) => (
  <div>{error.message}</div>
)

ValidationError.propTypes = {
  error: PropTypes.object,
}

ValidationError.defaultProps = {
  error: {},
}

export default ValidationError
