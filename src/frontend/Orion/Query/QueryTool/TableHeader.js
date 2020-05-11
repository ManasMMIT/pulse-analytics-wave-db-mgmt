import React, { useState } from 'react'
import styled from '@emotion/styled'
import {transparentize} from 'polished'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons"

import { Colors } from '../../../utils/pulseStyles'

const TableHeaderItem = styled.div({
  flex: 1,
  cursor: 'pointer',
  padding: 12,
  borderBottom: `2px solid ${transparentize(0.7, Colors.BLACK)}`,
  display: 'flex',
  justifyContent: 'space-between',
  ':hover': {
    background: transparentize(0.9, Colors.PRIMARY),
  }
})

const TableHeaderLabel = styled.div({
  fontSize: 12,
  color: transparentize(0.2, Colors.BLACK),
  fontWeight: 700,
  lineHeight: '24px',
  letterSpacing: -0.2,
})

const TableHeader = ({
  label,
  sortConfig,
}) => {
  const hasSortConfig = !_.isEmpty(sortConfig)
  const [sortOrder, handleSortOrder] = useState('asc')

  const arrowIcon = sortOrder === 'asc'
    ? faCaretUp
    : faCaretDown

  let handleClick = () => {
    console.log('sort config not supplied')
  }

  if (hasSortConfig) {
    const {
      tableData,
      setDataToDisplay,
      key,
    } = sortConfig

    handleClick = () => {
      const newSortOrder = sortOrder === 'asc'
        ? 'desc'
        : 'asc'

      const dataToDisplay = _.orderBy(
        tableData,
        [
          datum => {
            const value = datum[key]
            if (!value) {
              return null
            } else if (typeof value === 'number') {
              return value
            } else if (typeof value === 'string') {
              return value.toLowerCase()
            }
          }
        ],
        [newSortOrder]
      )

      setDataToDisplay(dataToDisplay)
      handleSortOrder(newSortOrder)
    }
  }

  return (
    <TableHeaderItem onClick={handleClick} >
      <TableHeaderLabel>{label}</TableHeaderLabel>
      {
        hasSortConfig && (
          <FontAwesomeIcon
            icon={arrowIcon}
            color={Colors.PRIMARY}
          />
        )
      }
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
