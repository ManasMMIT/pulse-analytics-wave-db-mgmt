import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import _ from 'lodash'
import {lighten, darken } from 'polished'

import Table from '@material-ui/core/Table'
import TableContainer from '@material-ui/core/TableContainer'
import TablePagination from '@material-ui/core/TablePagination'

import {
  REMOVE_PAYER_PROJECT_PTPS,
} from 'frontend/api/mutations'

import {
  GET_PAYER_PROJECT_PTPS,
} from 'frontend/api/queries'

import { Colors } from 'frontend/utils/pulseStyles'

import TreatmentPlansTableHead from './TreatmentPlansTableHead'
import TreatmentPlansTableBody from './TreatmentPlansTableBody'
import TransferPtpsModalButton from './TransferPtpsModalButton'

import { TABLE_HEADER_CONFIG } from '../utils'

const TableWrapper = styled.section({
  display: 'flex',
  flexDirection: 'column',
})

// ! TODO: to be replaced with reusable button component
const PlaceholderButton = styled.button({
  margin: 12,
  padding: '8px 12px',
  color: 'white',
  fontWeight: 700,
  backgroundColor: Colors.RED,
  borderRadius: 4,
  fontSize: 12,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: lighten(0.1, Colors.RED),
  },
  ':active': {
    backgroundColor: darken(0.1, Colors.RED),
  }
})

const sortData = ({ data, order, key }) => {
  return _.orderBy(data, [datum => datum[key].toLowerCase()], [order])
}

const TreatmentPlansTable = ({ data, checkbox }) => {
  const { projectId } = useParams()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selected, setSelected] = useState(new Set([]))
  const [order, setOrder] = useState('asc')
  const [tableData, setTableData] = useState(data)

  useEffect(() => {
    setTableData(data)
  }, [data])

  const [removePtps] = useMutation(
    REMOVE_PAYER_PROJECT_PTPS,
    {
      variables: {
        input: {
          orgTpIds: Array.from(selected),
        }
      },
      // ! Note: this isn't good enough for updating OTHER projects' tables; we're using
      // ! `fetchPolicy: network-only` on the original GET_PAYER_PROJECT_PTPS query also;
      // ! we still need this tho to refresh the table on the current view
      refetchQueries: [{ query: GET_PAYER_PROJECT_PTPS, variables: { input: { projectId } } }]
    }
  )

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
            <div>
              <TransferPtpsModalButton ptpIds={Array.from(selected)} />
              <PlaceholderButton onClick={removePtps}>
                Remove from Project
              </PlaceholderButton>
            </div>
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
