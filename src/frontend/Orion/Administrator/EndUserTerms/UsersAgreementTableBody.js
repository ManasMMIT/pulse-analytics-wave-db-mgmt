import React from 'react'
import PropTypes from 'prop-types'
import { transparentize } from 'polished'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'

import { Colors } from 'frontend/utils/pulseStyles'
import Icon from 'frontend/components/Icon'

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

  const renderCells = tableData
    .slice(paginateStartIdx, paginateEndIdx)
    .map(({ _id, endUserTerms: { timestamp, agreed } }) => {
      const icon = agreed ? faCheck : faTimes
      const iconColor = agreed ? 'green' : 'red'

      return (
        <TableRow key={_id}>
          <StyledTableCell>{_id}</StyledTableCell>
          <StyledTableCell align="center">
            <FontAwesomeIcon size="lg" icon={icon} color={iconColor} />
          </StyledTableCell>
          <StyledTableCell>{timestamp || 'N/A'}</StyledTableCell>
        </TableRow>
      )
    })

  return <TableBody>{renderCells}</TableBody>
}

ValidationErrorTableBody.propTypes = {
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  tableData: PropTypes.array.isRequired,
}

export default ValidationErrorTableBody
