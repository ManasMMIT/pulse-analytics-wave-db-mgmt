import React, { useRef, useEffect, useState } from 'react'

import _ from 'lodash'
import { useTable, useFilters, useSortBy, useFlexLayout } from 'react-table'
import { useSticky } from 'react-table-sticky'

import Headers from './Headers'
import Rows from './Rows'
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

const DEFAULT_COLUMN = {
  Filter: DefaultColumnFilter,
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
      defaultColumn: DEFAULT_COLUMN,
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
          <Rows
            rows={rows}
            prepareRow={prepareRow}
            columnWidth={columnWidth}
            setModalCell={setModalCell}
          />
        </div>
      </div>
      <ModalManager modalColMap={modalColMap} modalCell={modalCell} />
    </TableStyle>
  )
}

export default TemplateTable
