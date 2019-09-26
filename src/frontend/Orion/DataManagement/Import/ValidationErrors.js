import React from 'react'
import PropTypes from 'prop-types'

import ErrorList from './ErrorList'

const HEADERS = ['Value', 'Rows', 'Suggestions'] 

const ROW_CONFIG = [
  {
    key: 'value',
    color: 'red',
  },
  {
    key: 'sheetRows',
    color: 'black',
    csv: true,
  },
  {
    key: 'suggestion',
    color: 'blue',
  },
]

const ValidationErrors = ({ errors }) => {
  if (!errors) return null

  return (
    <div>
      {
        errors.map(({ type, problemRows }) => (
          <ErrorList
            style={{ marginBottom: 24 }}
            headers={HEADERS}
            type={type}
            data={problemRows}
            rowConfig={ROW_CONFIG}
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
