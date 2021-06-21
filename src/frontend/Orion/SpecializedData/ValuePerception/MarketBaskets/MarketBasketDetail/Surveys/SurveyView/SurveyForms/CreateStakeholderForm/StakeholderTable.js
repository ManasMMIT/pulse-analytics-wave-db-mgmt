import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useTable, usePagination, useRowSelect, useSortBy } from 'react-table'
import { Button } from '@pulse-analytics/pulse-design-system'

import TableWrapper from 'frontend/components/Table/TableWrapper'
import Pagination from 'frontend/components/Table/Pagination'
// import Headers from 'frontend/components/Table/Headers'

import Color from 'frontend/utils/color'

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
})

const PaginationSection = styled.section({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
})

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

const Table = ({ columns, data, onStakeholderDelete }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    selectedFlatRows,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useRowSelect,
    usePagination,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: () => <div></div>,
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  )

  return (
    <Container>
      <PaginationSection>
        <Pagination
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageOptions={pageOptions}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </PaginationSection>
      <TableWrapper>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </TableWrapper>
      <section style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          color={Color.RED}
          onClick={() => onStakeholderDelete(selectedFlatRows)}
          style={{ padding: '6px 12px' }}
        >
          Remove Selected Stakeholders
        </Button>
      </section>
    </Container>
  )
}

const StakeholderTable = ({ data, onStakeholderDelete }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'First Name',
        accessor: 'first_name',
      },
      {
        Header: 'Last Name',
        accessor: 'last_name',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
    ],
    []
  )

  return (
    <Table
      columns={columns}
      data={data}
      onStakeholderDelete={onStakeholderDelete}
    />
  )
}

StakeholderTable.propTypes = {
  data: PropTypes.array.isRequired,
  onStakeholderDelete: PropTypes.func.isRequired,
}

export default StakeholderTable
