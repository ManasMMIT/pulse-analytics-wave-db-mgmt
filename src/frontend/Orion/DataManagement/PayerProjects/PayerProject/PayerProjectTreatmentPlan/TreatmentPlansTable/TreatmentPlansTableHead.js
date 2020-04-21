import React from 'react'

import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Checkbox from '@material-ui/core/Checkbox'

const TreatmentPlansTableHead = ({
  handleSelectAllClick,
  handleColumnSort,
  isAllSelected,
  order,
  headerData,
  checkbox,
}) => (
  <TableHead>
    <TableRow>
      {
        checkbox && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={isAllSelected}
              onChange={handleSelectAllClick}
              inputProps={{ 'aria-label': 'select all payers' }}
            />
          </TableCell>
        )
      }
      {headerData.map(({ value, label }) => (
        <TableCell key={value}>
          <TableSortLabel
            active={value === 'payer'}
            direction={order}
            onClick={handleColumnSort}
          >
            {label}
          </TableSortLabel>
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
)

export default TreatmentPlansTableHead
