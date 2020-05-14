import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import _ from 'lodash'

import Table from '@material-ui/core/Table'
import TableContainer from '@material-ui/core/TableContainer'
import TablePagination from '@material-ui/core/TablePagination'

import TreatmentPlansTableHead from './TreatmentPlansTableHead'
import TreatmentPlansTableBody from './TreatmentPlansTableBody'

import { TABLE_HEADER_CONFIG } from '../utils'

const TableWrapper = styled.section({
  display: 'flex',
  flexDirection: 'column',
})

// ! TODO: to be replaced with reusable button component
const PlaceholderButton = styled.button({
  margin: 12,
  padding: 6,
  color: 'white',
  fontWeight: 700,
  backgroundColor: 'red',
})

const sortData = ({ data, order, key }) => {
  return _.orderBy(data, [datum => datum[key].toLowerCase()], [order])
}

const TreatmentPlansTable = ({ data, checkbox }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selected, setSelected] = useState(new Set([]))
  const [order, setOrder] = useState('asc')
  const [tableData, setTableData] = useState(data)

  useEffect(() => {
    setTableData(data)
  }, [data])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    setPage(0)
  }

  const handleColumnSort = () => {
    const newOrder = order === 'asc' ? 'desc' : 'asc'
    const sortedTableData = sortData({ data: tableData, order, key: 'payer' })

    setOrder(newOrder)
    setTableData(sortedTableData)
  }

  const isSelected = id => selected.has(id)
  const isAllSelected = selected.size === data.length

  const handleCheckboxClick = (event, id) => {
    const newSelectedSet = new Set([...selected])

    if (newSelectedSet.has(id)) {
      newSelectedSet.delete(id)
    } else {
      newSelectedSet.add(id)
    }

    setSelected(newSelectedSet)
  }

  const handleSelectAllClick = () => {
    let newSelectedSet
    if (isAllSelected) {
      newSelectedSet = new Set([])
    } else {
      newSelectedSet = tableData.reduce(
        (acc, { _id }) => acc.add(_id),
        new Set([])
      )
    }

    setSelected(newSelectedSet)
  }

  return (
    <TableWrapper>
      {checkbox && (
        <section style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ padding: 12 }}>
            {selected.size} Payer Treatments Selected
          </h2>
          {selected.size > 0 && (
            <PlaceholderButton>Remove from Project</PlaceholderButton>
          )}
        </section>
      )}
      <TableContainer style={{ height: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TreatmentPlansTableHead
            checkbox={checkbox}
            handleSelectAllClick={handleSelectAllClick}
            handleColumnSort={handleColumnSort}
            isAllSelected={isAllSelected}
            order={order}
            headerData={TABLE_HEADER_CONFIG}
          />
          <TreatmentPlansTableBody
            checkbox={checkbox}
            tableData={tableData}
            page={page}
            rowsPerPage={rowsPerPage}
            handleCheckboxClick={handleCheckboxClick}
            isSelected={isSelected}
            headerData={TABLE_HEADER_CONFIG}
          />
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </TableWrapper>
  )
}

export default TreatmentPlansTable
