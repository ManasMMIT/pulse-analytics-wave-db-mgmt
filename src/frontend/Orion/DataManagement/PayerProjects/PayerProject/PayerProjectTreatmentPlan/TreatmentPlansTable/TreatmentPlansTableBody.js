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
}) => (
  <TableBody>
    {tableData
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map(row => {
        const isItemSelected = isSelected(row.id)
        const labelId = `table-checkbox-${row.id}`
        return (
          <TableRow
            hover
            onClick={event => handleCheckboxClick(event, row.id)}
            role="checkbox"
            key={row.id}
            aria-checked={isItemSelected}
            selected={isItemSelected}
          >
            <TableCell padding="checkbox">
              <Checkbox
                checked={isItemSelected}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </TableCell>
            {headerData.map(column => {
              const label = row[column.value]
              return <TableCell key={`${row.id}-${label}`}>{label}</TableCell>
            })}
          </TableRow>
        )
      })}
  </TableBody>
)

export default TreatmentPlansTableBody
