import React from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled"

import ValidationError from './ValidationError'

const COLUMNS = ['type', 'rows', 'values', 'suggestions']

const TableHeader = styled.div({
  display: 'flex',
  fontWeight: 700,
})

const Column = styled.div({
  padding: 12,
  border: '1px solid black',
  width: 200,
  display: 'flex',
  justifyContent: 'center',
  boxSizing: 'border-box',
})

const ValidationErrors = ({ errors }) => (
  <>
    <TableHeader>
      {
        COLUMNS.map(label => (
          <Column key={`column-${label}`}>
            {label}
          </Column>
        ))
      }
    </TableHeader>
    {
      errors.map((error, idx) => (
        <ValidationError
          key={error.type}
          backgroundColor={idx % 2 === 0 ? "#8080804d" : "white"}
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
