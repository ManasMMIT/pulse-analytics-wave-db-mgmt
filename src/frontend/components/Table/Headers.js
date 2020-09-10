import React from 'react'
import styled from '@emotion/styled'
import Color from 'frontend/utils/color'

const HeaderCell = styled.div({
  color: Color.BLACK,
  fontSize: 12,
  fontWeight: 800,
  padding: 8,
  lineHeight: 1.5,
  background: Color.WHITE,
  display: 'flex !important',
  flexDirection: 'column',
  justifyContent: 'space-between',
  ':first-of-type': {
    paddingLeft: 24,
  },
  ':last-child': {
    paddingRight: 24,
  },
})

const SortIcon = styled.span({
  color: Color.BLUE,
  fontSize: 12,
  lineHeight: 1.5,
})

const FilterContainer = styled.div({
  marginTop: 4,
})

const Header = ({ headerGroup }) => {
  return headerGroup.headers.map((column) => (
    <HeaderCell
      {...column.getHeaderProps(column.getSortByToggleProps())}
      className="th"
    >
      <div style={{ overflowX: 'scroll' }}>
        {column.render('Header')}
        <SortIcon>
          {column.isSorted ? (column.isSortedDesc ? ' ⬇︎' : ' ⬆︎') : ''}
        </SortIcon>
      </div>
      <FilterContainer onClick={(e) => e.stopPropagation()}>
        {column.canFilter ? column.render('Filter') : null}
      </FilterContainer>
    </HeaderCell>
  ))
}

const Headers = ({ headerGroups }) => (
  <div className="header">
    {headerGroups.map((headerGroup) => (
      <div {...headerGroup.getHeaderGroupProps()} className="tr">
        <Header headerGroup={headerGroup} />
      </div>
    ))}
  </div>
)

export default Headers
