import React from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled"

const Row = styled.div({
  display: 'flex',
}, ({ backgroundColor }) => ({
  backgroundColor: backgroundColor,
}))

const Cell = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 200,
  boxSizing: 'border-box',
  padding: 12,
  border: '1px solid black',
  flexDirection: 'column',
})

const MultiCellWrapper = styled.div({
  flex: 1,
  display: 'flex',
})

const MultiCell = styled.div({
  padding: 12,
  boxSizing: 'border-box',
  width: '100%',
  textAlign: 'center',
  borderBottom: '1px solid black',
  flex: 1,
  minHeight: 50,
})

const ValidationError = ({
  backgroundColor,
  error: {
    type,
    problemRows,
  },
}) => {
  if (!problemRows.length) return null

  const {
    sheetRows,
    values,
    suggestions,
  } = problemRows.reduce((acc, { sheetRow, value, suggestion }) => {
    if (!acc.sheetRows.includes(sheetRow)) acc.sheetRows.push(sheetRow)
    if (!acc.values.includes(value)) acc.values.push(value)
    if (!acc.suggestions.includes(suggestion)) acc.suggestions.push(suggestion)

    return acc
  }, { sheetRows: [], values: [], suggestions: []})

  return (
    <Row backgroundColor={backgroundColor}>
      <Cell>
        {type}
      </Cell>
      <Cell>
        {sheetRows.join(', ')}
      </Cell>
      <MultiCellWrapper>
        <Cell style={{ padding: 0 }}>
          {values.map(value => <MultiCell>{value}</MultiCell>)}
        </Cell>
        <Cell style={{ padding: 0 }}>
          {suggestions.map(suggestion => <MultiCell>{suggestion}</MultiCell>)}
        </Cell>
      </MultiCellWrapper>
    </Row>
  )
}

ValidationError.propTypes = {
  error: PropTypes.object,
}

ValidationError.defaultProps = {
  error: {},
}

export default ValidationError
