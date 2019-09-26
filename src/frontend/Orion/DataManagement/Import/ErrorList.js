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
  background: '#ff000017',
  borderRadius: 2,
}, ({ background }) => ({ background }))

const ColumnItems = styled.span({
  padding: 12,
  overflowWrap: 'break-word',
  maxHeight: 40,
  overflowY: 'scroll',
}, ({ color, width }) => ({ color, width }))

const ErrorList = ({
  title,
  subtitle,
  type,
  headers,
  data,
  rowConfig,
  errorColor,
  style,
}) => (
  <div key={type} style={style}>
    <div>
      <Title>
          {title ||`${type.toUpperCase()} ERRORS`}
      </Title>
      <Subtitle>
        {subtitle || `Fix the following ${type} errors in the sheet and re-upload`}
      </Subtitle>
    </div>
    <RowWrapper>
      <div>
        <HeaderRowWrapper>
          {
            headers.map(header => (
              <ColumnItems
                key={header}
                width={`${ 100 / headers.length }%`}
              >
                {header}
              </ColumnItems>
            ))
          }
        </HeaderRowWrapper>
        <div>
          {
            data.map(datum => {
              const key = datum[rowConfig[0].key]

              return (
                <ProblemRowWrapper
                  background={errorColor} key={key}
                >
                  {
                    rowConfig.map(({ key, color, csv }) => {
                      const value = csv
                        ? datum[key].join(', ')
                        : datum[key]

                      const width = `${100 / rowConfig.length}%`

                      return (
                        <ColumnItems
                          key={key}
                          width={width}
                          color={color}
                        >
                          {value}
                        </ColumnItems>
                      )
                    })
                  }
                </ProblemRowWrapper>
              )
            })
          }
        </div>
      </div>
    </RowWrapper>
  </div>
)

ErrorList.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  type: PropTypes.string,
  headers: PropTypes.array,
  data: PropTypes.arrayOf(PropTypes.object),
  rowConfig: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  errorColor: PropTypes.string,
  style: PropTypes.object,
}

export default ErrorList
