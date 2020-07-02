import React from 'react'

const Header = ({ headerGroup }) => {
  return headerGroup.headers.map((column) => (
    <div
      {...column.getHeaderProps(column.getSortByToggleProps())}
      className="th"
    >
      {column.render('Header')}
      <span>
        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
      </span>
      <div onClick={(e) => e.stopPropagation()}>
        {column.canFilter ? column.render('Filter') : null}
      </div>
    </div>
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
