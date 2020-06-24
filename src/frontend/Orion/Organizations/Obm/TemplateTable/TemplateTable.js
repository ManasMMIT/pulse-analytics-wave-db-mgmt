import React from 'react'
import styled from '@emotion/styled'
import { useTable, useFilters, useSortBy } from 'react-table'

const TableWrapper = styled.div({
  height: '90%',
  overflow: 'auto',
})

const tableStyle = {
  margin: '12px 24px',
  width: '100%',
  display: 'block',
  height: 650,
  overflowY: 'scroll',
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

const defaultColumn = {
  Filter: DefaultColumnFilter,
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
