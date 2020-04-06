import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

const ValidationErrorTableBody = ({
  headerData,
  tableData,
  page,
  rowsPerPage,
}) => {
  const { message, error } = headerData
  const paginateStartIdx = page * rowsPerPage
  const paginateEndIdx = page * rowsPerPage + rowsPerPage

  const renderErrors = tableData
    .slice(paginateStartIdx, paginateEndIdx)
    .map(combo => (
      <TableRow key={_.kebabCase(combo)}>
        <TableCell>
          { message + error }
        </TableCell>
        <TableCell>
          { combo }
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
  headerData: PropTypes.object.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  tableData: PropTypes.array.isRequired,
}

export default ValidationErrorTableBody