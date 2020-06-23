import React from 'react'
import styled from '@emotion/styled'

import {
  useTable,
  // useGroupBy,
  useFilters,
  useSortBy,
  // useExpanded,
  // usePagination,
  // useGlobalFilter,
  // useAsyncDebounce,
} from 'react-table'

const StyledTd = styled.td({
  padding: 12,
})

const StyledTh = styled.th({
  fontWeight: 700,
  fontSize: 14,
  padding: 12,
})

const buttonStyle = {
  cursor: 'pointer',
  fontSize: 12,
}

const tableStyle = {
  margin: '12px 24px',
  width: '100%',
  display: 'block',
  height: 650,
  overflowY: 'scroll',
  borderCollapse: 'collapse',
}

// Define a default UI for filtering
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

const getHeaders = (headerGroup) => {
  return headerGroup.headers.map((column) => (
    <StyledTh {...column.getHeaderProps(column.getSortByToggleProps())}>
      {column.render('Header')}
      <span>
        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
      </span>
      <div onClick={(e) => e.stopPropagation()}>
        {column.canFilter ? column.render('Filter') : null}
      </div>
    </StyledTh>
  ))
}

const getRowCells = (row, modalColMap) => {
  return row.cells.map((cell) => {
    const { Modal, idKey } = modalColMap[cell.column.id]
    const datumId = cell.row.original[idKey]

    return (
      <StyledTd {...cell.getCellProps()}>
        <Modal buttonStyle={buttonStyle} entityId={datumId}>
          {cell.render('Cell')}
        </Modal>
      </StyledTd>
    )
  })
}

const TemplateTable = ({ columns, data, modalColMap }) => {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // state,
    // visibleColumns,
    // preGlobalFilteredRows,
    // setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      maxMultiSortColCount: 5,
      disableMultiRemove: true,
    },
    useFilters, // useFilters!
    useSortBy // ! must be after filter hooks. Throws error, if not.
    // useGlobalFilter,
  )

  // Render the UI for your table
  return (
    <table style={tableStyle} {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {getHeaders(headerGroup)}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)

          return <tr {...row.getRowProps()}>{getRowCells(row, modalColMap)}</tr>
        })}
      </tbody>
    </table>
  )
}

export default TemplateTable
