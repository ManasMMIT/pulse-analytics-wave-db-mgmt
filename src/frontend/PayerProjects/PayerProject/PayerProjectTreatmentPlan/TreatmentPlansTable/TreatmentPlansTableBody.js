import React from 'react'
import { transparentize } from 'polished'

import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import { withStyles } from '@material-ui/core/styles';

import { Colors } from 'frontend/utils/pulseStyles'

const StyledTableCell = withStyles({
  body: {
    fontSize: 12,
    color: Colors.BLACK,
    borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`
  },
})(TableCell);

const TreatmentPlansTableBody = ({
  tableData,
  page,
  rowsPerPage,
  handleCheckboxClick,
  isSelected,
  headerData,
  checkbox,
}) => (
  <TableBody>
    {tableData
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map(row => {
        const isItemSelected = isSelected(row._id)
        const labelId = `table-checkbox-${row._id}`
        return (
          <TableRow
            hover
            onClick={event => handleCheckboxClick(event, row._id)}
            role="checkbox"
            key={row._id}
            aria-checked={isItemSelected}
            selected={isItemSelected}
          >
            {checkbox && (
              <StyledTableCell padding="checkbox">
                <Checkbox
                  checked={isItemSelected}
                  size="small"
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </StyledTableCell>
            )}
            {headerData.map(column => {
              const label = column.value
                .split('.')
                .reduce((prev, key) => prev[key], row)

              return <StyledTableCell key={`${row._id}-${label}`}>{label}</StyledTableCell>
            })}
          </TableRow>
        )
      })}
  </TableBody>
)

export default TreatmentPlansTableBody
