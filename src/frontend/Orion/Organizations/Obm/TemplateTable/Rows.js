import React from 'react'
import styled from '@emotion/styled'

import Cell from './Cell'

const Row = styled.div({})

const Rows = ({ rows, prepareRow, setModalCell, modalColMap }) => {
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
            <Cell className={className} onClick={() => setModalCell(cell)} {...cell.getCellProps()}>
              {cell.render('Cell')}
            </Cell>
          )
        })}
      </Row>
    )
  })
}

export default Rows
