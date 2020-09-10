import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Color from 'frontend/utils/color'

const StyledInput = styled.input({
  width: 60,
  border: `1px solid ${transparentize(0.9, Color.BLACK)}`,
  borderRadius: 2,
  padding: 4,
  fontSize: 11,
  ':placeholder': {
    color: transparentize(0.5, Color.BLACK),
  },
  ':hover': {
    border: `1px solid ${transparentize(0.85, Color.BLACK)}`,
  },
  ':focus': {
    boxShadow: `0 0 0 2px ${Color.BLUE}`,
  },
})

const NumberRangeColumnFilter = ({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) => {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <StyledInput
        value={filterValue[0] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder={`Min (${min})`}
        style={{ marginRight: 4 }}
      />
      <span
        style={{
          opacity: 0.5,
        }}
      >
        to
      </span>
      <StyledInput
        value={filterValue[1] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder={`Max (${max})`}
        style={{ marginLeft: 4 }}
      />
    </div>
  )
}

export default NumberRangeColumnFilter
