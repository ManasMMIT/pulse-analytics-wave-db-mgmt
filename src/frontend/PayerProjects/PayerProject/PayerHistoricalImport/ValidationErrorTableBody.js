import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

const ValidationErrorTableBody = ({
  tableData,
  page,
  rowsPerPage,
}) => {
  const paginateStartIdx = page * rowsPerPage
  const paginateEndIdx = page * rowsPerPage + rowsPerPage

  const renderErrors = tableData
    .slice(paginateStartIdx, paginateEndIdx)
    .map(({ scenario, message, suggestion }) => (
      <TableRow key={`${ message }-${_.kebabCase(suggestion)}`}>
        <TableCell>
          { scenario }
        </TableCell>
        <TableCell>
          { message }
        </TableCell>
        <TableCell>
          { suggestion }
        </TableCell>
      </TableRow>
    ))

  return (
    <TableBody>
      { renderErrors }
    </TableBody>
  )
}

ValidationErrorTableBody.propTypes = {
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  tableData: PropTypes.array.isRequired,
}

export default ValidationErrorTableBody