import React from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled"

const Title = styled.div({
  fontSize: 20,
  fontWeight: 500,
})

const Subtitle = styled.div({
  color: '#808080bd',
  lineHeight: 1.5,
})

const RowWrapper = styled.div({
  justifyContent: 'space-between',
})

const HeaderRowWrapper = styled.div({
  display: 'flex',
  padding: 8,
  margin: 6,
  paddingLeft: 24,
  marginLeft: 0,
})

const ProblemRowWrapper = styled.div({
  display: 'flex',
  padding: 8,
  margin: 6,
  paddingLeft: 24,
  marginLeft: 0,
  background: '#ff000029',
  borderRadius: 2,
}, ({ background }) => ({ background }))

const ColumnItems = styled.span({
  width: '33%',
  padding: 12,
  overflowWrap: 'break-word',
  maxHeight: 40,
  overflowY: 'scroll',
}, ({ color }) => ({ color }))

const ValidationError = ({
  type,
  problemRows,
  errorColor,
  rowColors,
  style,
}) => (
  <div key={type} style={style}>
    <div>
      <Title>
        {`${type.toUpperCase()} ERRORS`}
      </Title>
      <Subtitle>
        {`Fix the following ${type} errors in the sheet and re-upload`}
      </Subtitle>
    </div>
    <RowWrapper>
      <div>
        <HeaderRowWrapper>
          <ColumnItems>Value</ColumnItems>
          <ColumnItems>Rows</ColumnItems>
          <ColumnItems>Suggestions</ColumnItems>
        </HeaderRowWrapper>
        <div>
          {
            problemRows.map(({ value, sheetRows, suggestion }) => (
              <ProblemRowWrapper background={errorColor} key={value}>
                <ColumnItems color={rowColors[0]}>
                  {value}
                </ColumnItems>
                <ColumnItems color={rowColors[1]}>
                  {sheetRows.join(', ')}
                </ColumnItems>
                <ColumnItems color={rowColors[2]}>
                  {suggestion}
                </ColumnItems>
              </ProblemRowWrapper>
            ))
          }
        </div>
      </div>
    </RowWrapper>
  </div>
)

ValidationError.propTypes = {
  style: PropTypes.object,
  type: PropTypes.string,
  problemRows: PropTypes.array,
  errorColor: PropTypes.string,
  rowColors: PropTypes.array,
}

export default ValidationError
