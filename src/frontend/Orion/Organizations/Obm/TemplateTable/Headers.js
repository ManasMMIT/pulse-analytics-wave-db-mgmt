import React from 'react'

const Header = ({ headerProps, column }) => (
  <div {...headerProps} className="th">
    {column.render('Header')}
    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
    <div onClick={(e) => e.stopPropagation()}>
      {column.canFilter ? column.render('Filter') : null}
    </div>
  </div>
)

const Headers = ({ headerGroups, columnWidth }) => {
  return (
    <div className="header">
      {headerGroups.map((headerGroup) => {
        return (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map((column) => {
              const headerProps = column.getHeaderProps(
                column.getSortByToggleProps()
              )
              headerProps.style.width = `${columnWidth}px`
              headerProps.style.overflow = 'visible'

              return <Header headerProps={headerProps} column={column} />
            })}
          </div>
        )
      })}
    </div>
  )
}

export default Headers
