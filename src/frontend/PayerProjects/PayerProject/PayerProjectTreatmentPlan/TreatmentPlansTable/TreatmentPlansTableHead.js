import React from 'react'
import { transparentize } from 'polished'

import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { withStyles } from '@material-ui/core/styles';

import { Colors } from 'frontend/utils/pulseStyles'

const StyledTableCell = withStyles({
  head: {
    fontSize: 12,
    fontWeight: 800,
    color: Colors.BLACK,
    borderBottom: `2px solid ${transparentize(0.5, Colors.BLACK)}`,
  },
})(TableCell);


const TreatmentPlansTableHead = ({
  handleSelectAllClick,
  handleColumnSort,
  isAllSelected,
  order,
  headerData,
  checkbox,
}) => (
  <TableHead>
    <TableRow style={{backgroundColor: Colors.WHITE}}>
      {
        checkbox && (
          <StyledTableCell padding="checkbox">
            <Checkbox
              checked={isAllSelected}
              onChange={handleSelectAllClick}
              size="small"
              inputProps={{ 'aria-label': 'select all payers' }}
            />
          </StyledTableCell>
        )
      }
      {headerData.map(({ value, label }) => (
        <StyledTableCell key={value}>
          <TableSortLabel
            active={value === 'payer'}
            direction={order}
            onClick={handleColumnSort}
          >
            {label}
          </TableSortLabel>
        </StyledTableCell>
      ))}
    </TableRow>
  </TableHead>
)

export default TreatmentPlansTableHead
