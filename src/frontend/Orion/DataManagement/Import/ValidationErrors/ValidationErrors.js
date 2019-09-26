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
})

const ColumnItems = styled.span({
  width: '33%',
  overflowWrap: 'break-word',
}, ({ color }) => ({ color }))

const ValidationErrors = ({ errors }) => {
  if (!errors) return null
  debugger
  return (
    <div>
      {
        errors.map(({ type, problemRows }, idx, errors) => (
          <div key={type} style={idx !== errors.length ? { marginBottom: 24 } : {}}>
            <div>
              <Title>
                {`${ type.toUpperCase() } ERRORS`}
              </Title>
              <Subtitle>
                {`Fix the following ${ type } errors in the sheet and re-upload`}
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
                      <ProblemRowWrapper key={value}>
                        <ColumnItems color={'red'}>{ value }</ColumnItems>
                        <ColumnItems>{ sheetRows.join(', ') }</ColumnItems>
                        <ColumnItems color={'blue'}>{ suggestion }</ColumnItems>
                      </ProblemRowWrapper>
                    ))
                  }
                </div>
              </div>
            </RowWrapper>
          </div>
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
