import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Table from '@material-ui/core/Table'
import TableContainer from '@material-ui/core/TableContainer'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'

import Spinner from 'frontend/components/Spinner'

import { GET_END_USER_TERMS_USERS } from 'frontend/api/queries'
import { Colors } from 'frontend/utils/pulseStyles'

import UsersAgreementTableBody from './UsersAgreementTableBody'

const TableWrapper = styled.section({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const tableHeaderStyle = {
  fontSize: 12,
  fontWeight: 800,
  color: Colors.BLACK,
  borderBottom: `2px solid ${transparentize(0.9, Colors.BLACK)}`,
}

const UsersAgreementTable = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(150)

  // ! When a user is deleted in Phoenix, 'network-only' will make sure
  // ! that the users fetched for the table are fresh
  const { data, loading } = useQuery(GET_END_USER_TERMS_USERS, {
    fetchPolicy: 'network-only',
  })

  if (loading) return <Spinner />

  const { endUserTermsUsers } = data

  const handleChangePage = (_, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value))
    setPage(0)
  }

  return (
    <TableWrapper>
      <TableContainer style={{ maxHeight: 400 }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              <TableCell style={tableHeaderStyle}> User ID </TableCell>
              <TableCell style={tableHeaderStyle} align="center">
                Accepted?
              </TableCell>
              <TableCell style={tableHeaderStyle}> Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <UsersAgreementTableBody
            tableData={endUserTermsUsers}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={endUserTermsUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        style={{ borderTop: `1px solid ${transparentize(0.9, Colors.BLACK)}` }}
      />
    </TableWrapper>
  )
}

export default UsersAgreementTable
