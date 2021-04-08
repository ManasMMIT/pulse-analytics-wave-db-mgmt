import React from 'react'
import _ from 'lodash'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Color from 'frontend/utils/color'
import { Colors } from '../../../../utils/pulseStyles'

import CreateModalButton from './CreateModalButton'
import UpdateModalButton from './UpdateModalButton'

const Wrapper = styled.div(
  {
    display: 'flex',
    flexDirection: 'column',
    background: Color.WHITE,
  },
  (props) => ({
    ...props.style,
  })
)

const SHARED_BORDER = `1px solid ${transparentize(0.9, Color.BLACK)}`

const columnHeaderStyle = {
  background: Colors.LIGHT_BLUE_GRAY_2,
  fontWeight: 700,
  display: 'flex',
  margin: '0 24px',
  alignItems: 'center',
}

const getColumnStyle = (columnWidth) => ({
  width: columnWidth,
  padding: '12px 6px',
  border: SHARED_BORDER,
  fontSize: 13,
})

const getRowStyle = (columnWidth) => ({
  width: columnWidth,
  padding: 6,
  border: SHARED_BORDER,
  fontSize: 12,
  height: 40,
  overflowY: 'scroll',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
})

const MAX_COL_LENGTH = 5

const QueryToolTable = ({
  data,
  loading,
  businessObjectName,
  afterMutationHook,
  refetchQueries,
}) => {
  const { _id, ...columnsSample } = data[0] || {}

  let columns
  let columnWidth
  if (!_.isEmpty(data)) {
    columns = Object.keys(columnsSample).slice(0, MAX_COL_LENGTH)
    columnWidth = `${100 / columns.length}%`
  }

  return (
    <>
      <CreateModalButton
        businessObjectName={businessObjectName}
        afterMutationHook={afterMutationHook}
        refetchQueries={refetchQueries}
      />
      {!_.isEmpty(data) && (
        <Wrapper>
          <div style={columnHeaderStyle}>
            {columns.map((label) => (
              <div key={label} style={getColumnStyle(columnWidth)}>
                {label}
              </div>
            ))}
          </div>

          <div style={{ maxHeight: 600, overflowY: 'scroll' }}>
            {loading
              ? null
              : data.map((row, rowIdx) => {
                  const rowStyle = getRowStyle(columnWidth)

                  const cells = columns.map((columnKey, colIdx) => {
                    let extraStyles = {}

                    // ! react errors loudly when passed improper children
                    let cell = coerceToString(row[columnKey])
                    if (colIdx === 0) {
                      extraStyles = { marginLeft: 24 }

                      cell = (
                        <UpdateModalButton
                          businessObjectName={businessObjectName}
                          afterMutationHook={afterMutationHook}
                          entityId={row._id}
                          refetchQueries={refetchQueries}
                        >
                          {cell}
                        </UpdateModalButton>
                      )
                    } else if (colIdx === columns.length - 1) {
                      extraStyles = { marginRight: 24 }
                    }

                    return (
                      <span
                        key={`${rowIdx}-${colIdx}`}
                        style={{ ...rowStyle, ...extraStyles }}
                      >
                        {cell}
                      </span>
                    )
                  })

                  return (
                    <div key={row._id} style={{ display: 'flex' }}>
                      {cells}
                    </div>
                  )
                })}
          </div>
        </Wrapper>
      )}
    </>
  )
}

const coerceToString = (value) => {
  if (_.isArray(value)) return value.join(', ')

  if (_.isObject(value)) return JSON.stringify(value)

  return value
}

QueryToolTable.defaultProps = {
  data: [],
}

export default QueryToolTable
