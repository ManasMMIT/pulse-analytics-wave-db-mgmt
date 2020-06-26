import React from 'react'
import styled from '@emotion/styled'
import _ from 'lodash'
import { useTable, useFilters, useSortBy } from 'react-table'

const TableWrapper = styled.div({
  overflow: 'auto',
  margin: '0 24px 24px 24px',
})

const tableStyle = {
  borderCollapse: 'collapse',
}

const StyledTh = styled.th({
  fontWeight: 700,
  fontSize: 14,
  padding: 12,
  position: 'sticky',
  top: 0,
  borderTop: '1px solid black',
  borderLeft: '1px solid rgba(200, 209, 224, 0.6)',
  borderBottom: '1px solid #e8e8e8',
  background: 'white',
  boxShadow: '0px 0px 0 2px #e8e8e8',
})

const StyledTd = styled.td({
  padding: 12,
  border: '1px solid #e8e8e8',
})

const buttonStyle = {
  cursor: 'pointer',
  fontSize: 12,
}

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

const Headers = ({ headerGroup }) => {
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

const Cells = ({ row, modalColMap }) => {
  return row.cells.map((cell) => {
    if (cell.column.id in modalColMap) {
      const { Modal, idKey } = modalColMap[cell.column.id]
      const datumId = cell.row.original[idKey]

      return (
        <StyledTd {...cell.getCellProps()}>
          <Modal
            key={cell.row.original._id}
            buttonStyle={buttonStyle}
            entityId={datumId}
          >
            {cell.render('Cell')}
          </Modal>
        </StyledTd>
      )
    }

    return <StyledTd {...cell.getCellProps()}>{cell.render('Cell')}</StyledTd>
  })
}

const defaultColumn = {
  Filter: DefaultColumnFilter,
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

const TemplateTable = ({ columns, data, modalColMap }) => {
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
    useFilters,
    useSortBy
  )

  return (
    <TableWrapper>
      <table style={tableStyle} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              <Headers headerGroup={headerGroup} />
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)

            return (
              <tr {...row.getRowProps()}>
                <Cells row={row} modalColMap={modalColMap} />
              </tr>
            )
          })}
        </tbody>
      </table>
    </TableWrapper>
  )
}

export default TemplateTable
