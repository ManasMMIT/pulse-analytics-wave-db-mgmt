import React, { useRef, useEffect, useState } from 'react'

import _ from 'lodash'
import { useTable, useFilters, useSortBy, useFlexLayout } from 'react-table'
import { useSticky } from 'react-table-sticky'

import ModalManager from './ModalManager'
import TableStyle from './TableStyle'
import sortTypes from './custom-sort-types'

const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

const cellStyle = {
  cursor: 'pointer',
  fontSize: 12,
}

const MINIMUM_COLUMN_WIDTH = 200

function TemplateTable({ columns, data, modalColMap }) {
  const [modalCell, setModalCell] = useState(null)
  const [ø, forceRender] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      forceRender(ref.current.offsetWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [data, ref])

  const defaultColumn = {
    Filter: DefaultColumnFilter,
  }

  const columnWidthBasedOnParent = Math.floor(
    (ref.current ? ref.current.offsetWidth : 0) / columns.length
  )
  const columnWidth = Math.max(columnWidthBasedOnParent, MINIMUM_COLUMN_WIDTH)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      maxMultiSortColCount: 5,
      disableMultiRemove: true,
      sortTypes,
    },
    useSticky,
    useFlexLayout,
    useFilters,
    useSortBy
  )

  return (
    <TableStyle>
      <div
        ref={ref}
        {...getTableProps()}
        className="table sticky"
        style={{ minWidth: 200, width: 'calc(100vw - 320px)', height: 400 }}
      >
        <Headers headerGroups={headerGroups} columnWidth={columnWidth} />
        <div {...getTableBodyProps()} className="body">
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => {
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
                })}
              </div>
            )
          })}
        </div>
      </div>
      <ModalManager modalColMap={modalColMap} modalCell={modalCell} />
    </TableStyle>
  )
}

export default TemplateTable

const Header = ({ headerProps, column }) => (
  <div {...headerProps} className="th">
    {column.render('Header')}
    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
    <div onClick={(e) => e.stopPropagation()}>
      {column.canFilter ? column.render('Filter') : null}
    </div>
  </div>
)

const Headers = ({ headerGroups, columnWidth }) => {
  return (
    <div className="header">
      {headerGroups.map((headerGroup) => {
        return (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map((column) => {
              const headerProps = column.getHeaderProps(
                column.getSortByToggleProps()
              )
              headerProps.style.width = `${columnWidth}px`
              headerProps.style.overflow = 'visible'

              return <Header headerProps={headerProps} column={column} />
            })}
          </div>
        )
      })}
    </div>
  )
}
