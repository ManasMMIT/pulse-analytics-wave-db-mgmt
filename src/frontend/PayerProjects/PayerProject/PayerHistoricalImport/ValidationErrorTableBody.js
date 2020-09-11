import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { transparentize } from 'polished'

import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'

import { Colors } from 'frontend/utils/pulseStyles'

const StyledTableCell = withStyles({
  body: {
    fontSize: 12,
    color: Colors.BLACK,
    borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  },
})(TableCell)

const ValidationErrorTableBody = ({ tableData, page, rowsPerPage }) => {
  const paginateStartIdx = page * rowsPerPage
  const paginateEndIdx = page * rowsPerPage + rowsPerPage

  const renderErrors = tableData
    .slice(paginateStartIdx, paginateEndIdx)
    .map(({ scenario, message, suggestion }) => (
      <TableRow
        key={`${message}-${_.kebabCase(suggestion)}`}
        style={{ backgroundColor: Colors.WHITE }}
      >
        <StyledTableCell style={{ color: Colors.RED, fontWeight: 600 }}>
          {scenario}
        </StyledTableCell>
        <StyledTableCell>{message}</StyledTableCell>
        <StyledTableCell>{suggestion || 'N/A'}</StyledTableCell>
      </TableRow>
    ))

  return <TableBody>{renderErrors}</TableBody>
}

ValidationErrorTableBody.propTypes = {
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  tableData: PropTypes.array.isRequired,
}

export default ValidationErrorTableBody
