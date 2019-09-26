import React from 'react'
import PropTypes from 'prop-types'

import ValidationError from './ValidationError'

const ValidationErrors = ({ errors }) => {
  if (!errors) return null

  return (
    <div>
      {
        errors.map(({ type, problemRows }) => (
          <ValidationError
            style={{ marginBottom: 24 }}
            type={type}
            problemRows={problemRows}
            rowColors={['red', 'black', 'blue']}
          />
        ))
      }
    </div>
  )
}

ValidationErrors.propTypes = {
  errors: PropTypes.array,
}

ValidationErrors.defaultProps = {
  errors: [],
}

export default ValidationErrors
