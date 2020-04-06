import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Table from '@material-ui/core/Table'
import TableContainer from '@material-ui/core/TableContainer'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'

import ValidationErrorTableBody from './ValidationErrorTableBody'

const TableWrapper = styled.section({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const ValidationErrorTable = ({
  validationErrors
}) => {
  const formattedErrors = validationErrors.split('\n').filter(line => !!line)
  const [message, error, ...combinations] = formattedErrors
  const shouldShowTable = validationErrors.length !== 0
  const headerData = { error, message }

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  
  const handleChangePage = (_, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    setPage(0)
  }

  return shouldShowTable && (
    <TableWrapper>
      <TableContainer style={{ maxHeight: 400 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell> Error </TableCell>
              <TableCell> Combinations </TableCell>
            </TableRow>
          </TableHead>
          <ValidationErrorTableBody
            tableData={combinations}
            headerData={headerData}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={formattedErrors.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </TableWrapper>
  )
}

ValidationErrorTable.propTypes = {
  validationErrors: PropTypes.string,
}

ValidationErrorTable.defaultProps = {
  validationErrors: '',
}

export default ValidationErrorTable