import React, { useRef, useEffect, useState } from 'react'
import styled from '@emotion/styled'

import _ from 'lodash'
import { useTable, useFilters, useSortBy, useFlexLayout } from 'react-table'
import { useSticky } from 'react-table-sticky'

const Styles = styled.div`
  padding: 1rem;

  .table {
    .tr {
      :hover {
        background: grey;
      }
    }

    .th,
    .td {
      padding: 5px;
      border: 1px solid #ddd;
      background-color: #fff;
      overflow: hidden;

      .resizer {
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;

        &.isResizing {
          background: red;
        }
      }
    }

    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }

      .header {
        top: 0;
        box-shadow: 0px 3px 3px #ccc;
      }

      .footer {
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }

      .body {
        position: relative;
        z-index: 0;
      }

      [data-sticky-td] {
        position: sticky;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px #ccc;
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }
  }
`

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

const SORT_TYPES = {
  text: (rowA, rowB, columnId, desc) => {
    const valueA = rowA.values[columnId]
    const valueB = rowB.values[columnId]

    if (_.isEmpty(valueA) && _.isEmpty(valueB)) return 0
    if (_.isEmpty(valueB)) return -1
    if (_.isEmpty(valueA)) return 1

    return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
  },
}

const cellStyle = {
  cursor: 'pointer',
  fontSize: 12,
}

const MINIMUM_COLUMN_WIDTH = 200

function TemplateTable({ columns, data, modalColMap }) {
  const ref = useRef(null)
  const [ø, forceRender] = useState(0)
  const [modalCell, setModalCell] = useState(null)

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
      sortTypes: SORT_TYPES,
    },
    useSticky,
    useFlexLayout,
    useFilters,
    useSortBy
  )

  return (
    <Styles>
      <div
        ref={ref}
        {...getTableProps()}
        className="table sticky"
        style={{ minWidth: 200, width: 'calc(100vw - 320px)', height: 400 }}
      >
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

                  return (
                    <div {...headerProps} className="th">
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                      <div onClick={(e) => e.stopPropagation()}>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

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
    </Styles>
  )
}

export default TemplateTable

const ModalManager = ({ modalColMap, modalCell }) => {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (modalCell) setIsOpen(true)
  }, [modalCell])

  if (!modalCell || !isOpen) return null

  const cellModalInfo = modalColMap[modalCell.column.id]

  if (!cellModalInfo) return null

  const { Modal, idKey } = cellModalInfo

  const entityId = modalCell.row.original[idKey]

  if (!entityId) return null

  return <Modal entityId={entityId} closeModal={() => setIsOpen(false)} />
}
