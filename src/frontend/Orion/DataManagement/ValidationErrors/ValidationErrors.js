import React from 'react'
import PropTypes from 'prop-types'

import ValidationError from './ValidationError'

const ValidationErrors = ({ errors }) => (
  <>
    <div>ERRORS</div>
    {
      errors.map(error => (
        <ValidationError
          key={error.message}
          error={error}
        />
      ))
    }
  </>
)

ValidationErrors.propTypes = {
  errors: PropTypes.array,
}

ValidationErrors.defaultProps = {
  errors: [],
}

export default ValidationErrors
