import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Color from 'frontend/utils/color'

import Cell from './Cell'

const Row = styled.div({
  ':hover': {
    backgroundColor: `${transparentize(0.5, Color.LIGHT_GRAY_1)} !important`,
  },
})

const Rows = ({
  rows,
  prepareRow,
  setModalCell,
  modalColMap,
  onRowClickOverride,
}) => {
  const onClickFunc = onRowClickOverride || setModalCell

  return rows.map((row) => {
    prepareRow(row)

    return (
      <Row {...row.getRowProps()} className="tr">
        {row.cells.map((cell) => {
          let className = 'td'

          // to style a clickable cell, go to TableWrapper.js, under .clickable-cell class
          if (cell.column.id in modalColMap) {
            className += ' clickable-cell'
          }

          return (
            <Cell
              className={className}
              onClick={() => onClickFunc(cell)}
              {...cell.getCellProps()}
            >
              {cell.render('Cell')}
            </Cell>
          )
        })}
      </Row>
    )
  })
}

export default Rows
