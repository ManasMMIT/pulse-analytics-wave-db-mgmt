import React from 'react'
import _ from 'lodash'

const cellStyle = { cursor: 'pointer', fontSize: 12 }

const Cell = ({ cell, columnWidth, setModalCell }) => {
  const cellProps = cell.getCellProps()

  cellProps.style = _.merge({}, cellProps.style, {
    ...cellStyle,
    width: `${columnWidth}px`,
  })

  const handleModalCellClick = (e, cell) => {
    e.stopPropagation()
    setModalCell(cell)
  }

  return (
    <div
      className="td"
      onClick={(e) => handleModalCellClick(e, cell)}
      {...cellProps}
    >
      {cell.render('Cell')}
    </div>
  )
}

export default Cell
