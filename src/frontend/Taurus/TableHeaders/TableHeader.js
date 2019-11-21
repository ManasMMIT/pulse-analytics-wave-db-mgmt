import React, { useState } from 'react'
import styled from '@emotion/styled'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons"

const Label = styled.span({

})

const TableHeaderItem = styled.div({
  flex: 1,
  cursor: 'pointer',
  padding: 12,
  border: '1px solid grey',
  display: 'flex',
  justifyContent: 'space-between',
})

const TableHeader = ({
  label,
  sortConfig: {
    tableData,
    setDataToDisplay,
    key,
  }
}) => {
  const [sortOrder, handleSortOrder] = useState('asc')

  const arrowIcon = sortOrder === 'asc'
    ? faCaretUp
    : faCaretDown

  const handleClick = () => {
    const newSortOrder = sortOrder === 'asc'
      ? 'desc'
      : 'asc'

    const dataToDisplay = _.orderBy(
      tableData,
      [
        datum => {
          return datum[key]
            ? datum[key].toLowerCase()
            : null
        }
      ],
      [newSortOrder]
    )

    setDataToDisplay(dataToDisplay)
    handleSortOrder(newSortOrder)
  }

  return (
    <TableHeaderItem
      onClick={handleClick}
    >
      <Label>{label}</Label>
      <FontAwesomeIcon
        size="lg"
        icon={arrowIcon}
      />
    </TableHeaderItem>
  )
}

TableHeader.propTypes = {
  label: PropTypes.string,
  sortConfig: PropTypes.shape({
    tableData: PropTypes.array,
    setDataToDisplay: PropTypes.func,
    key: PropTypes.string,
  })
}

export default TableHeader