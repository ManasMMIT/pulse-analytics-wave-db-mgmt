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
  width: 200,
  boxSizing: 'border-box',
  padding: 12,
  border: '1px solid black',
  flexDirection: 'column',
})

const ValidationError = ({
  backgroundColor,
  error: {
    type,
    problemRows,
  },
}) => {
  if (!problemRows.length) return null

  return (
    <Row backgroundColor={backgroundColor}>
      <Cell>
        {type}
      </Cell>
      <div>
        {
          problemRows.map(row => (
            <div key={row.value} style={{ display: 'flex' }}>
              <Cell>
                {row.sheetRows.join(', ')}
              </Cell>
              <Cell>
                {row.value}
              </Cell>
              <Cell>
                {row.suggestion}
              </Cell>
            </div>
          ))
        }
      </div>
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
