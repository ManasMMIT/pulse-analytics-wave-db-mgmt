import React from 'react'

import Cell from './Cell'

const Row = ({ row, columnWidth, setModalCell }) => {
  return (
    <div {...row.getRowProps()} className="tr">
      {row.cells.map((cell) => {
        return (
          <Cell
            cell={cell}
            columnWidth={columnWidth}
            setModalCell={setModalCell}
          />
        )
      })}
    </div>
  )
}

const Rows = ({ rows, prepareRow, columnWidth, setModalCell }) => {
  return rows.map((row) => {
    prepareRow(row)
    return (
      <Row row={row} columnWidth={columnWidth} setModalCell={setModalCell} />
    )
  })
}

export default Rows
