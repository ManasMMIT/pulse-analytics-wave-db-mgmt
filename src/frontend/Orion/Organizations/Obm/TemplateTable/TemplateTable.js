import React, { useState } from 'react'
import _ from 'lodash'

import { useTable, useBlockLayout, useFilters, useSortBy } from 'react-table'
import { useSticky } from 'react-table-sticky'

import TableWrapper from './TableWrapper'
import Headers from './Headers'
import Rows from './Rows'
import ModalManager from './ModalManager'
import sortTypes from './custom-sort-types'

import ExportExcelButton from 'frontend/components/ExportExcelButton'
import formatDataForExport from './formatDataForExport'

const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
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

const TemplateTable = ({ columns, data, modalColMap, exportProps }) => {
  const [modalCell, setModalCell] = useState(null)

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, sortedRows } = useTable(
    {
      columns,
      data,
      defaultColumn: DEFAULT_COLUMN,
      maxMultiSortColCount: 5,
      disableMultiRemove: true,
      sortTypes,
    },
    useFilters,
    useSortBy,
    useBlockLayout,
    useSticky
  )

  const dataFormattedForExport = formatDataForExport(sortedRows, columns)

  return (
    <>
      <div style={{ margin: '0 24px 0 auto' }}>
        <ExportExcelButton
          data={dataFormattedForExport}
          // buttonStyle={} // if custom button styling is needed, style here
          {...exportProps}
        >
          Export Current View to Excel
        </ExportExcelButton>
      </div>

      <TableWrapper>
        <div className="table sticky" style={{ height: '100%' }} {...getTableProps()}>
          <Headers headerGroups={headerGroups} />

          <div {...getTableBodyProps()} className="body">
            <Rows
              rows={rows}
              prepareRow={prepareRow}
              setModalCell={setModalCell}
              modalColMap={modalColMap}
            />
          </div>
        </div>
      </TableWrapper>

      <ModalManager modalColMap={modalColMap} modalCell={modalCell} />
    </>
  )
}

export default TemplateTable
