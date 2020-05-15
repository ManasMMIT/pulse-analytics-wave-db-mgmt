import React from 'react'

import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'

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
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isItemSelected}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </TableCell>
            )}
            {headerData.map(column => {
              const label = column.value
                .split('.')
                .reduce((prev, key) => prev[key], row)

              return <TableCell key={`${row._id}-${label}`}>{label}</TableCell>
            })}
          </TableRow>
        )
      })}
  </TableBody>
)

export default TreatmentPlansTableBody
