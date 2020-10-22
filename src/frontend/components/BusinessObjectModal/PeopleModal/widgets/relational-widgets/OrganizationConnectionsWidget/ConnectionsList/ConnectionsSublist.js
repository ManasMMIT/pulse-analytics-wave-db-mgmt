import React from 'react'

import Sublist from 'frontend/components/List/Sublist'
import SublistHeaderRow from 'frontend/components/List/SublistHeaderRow'

import ConnectionListItem from './ConnectionListItem'

import { isoShortToDateMonthYearLong } from 'frontend/utils/formatDate'
import Color from 'frontend/utils/color'

const SUBLIST_MAP = {
  active: {
    rowColor: Color.GREEN,
    isDisabled: false,
    formatter: null,
  },
  excluded: {
    rowColor: Color.GRAY_DARK,
    isDisabled: true,
    formatter: null,
  },
  outdated: {
    rowColor: Color.GRAY_DARK,
    isDisabled: true,
    formatter: isoShortToDateMonthYearLong,
  },
}

const ConnectionsSublist = ({
  status,
  data,
  selectedOrganization,
  orgClickHandler,
}) => {
  const { rowColor, formatter, isDisabled } = SUBLIST_MAP[status]

  return (
    <Sublist>
      <SublistHeaderRow
        text={`${status} (${data.length})`}
        rowColor={rowColor}
      />
      {data.map((datum) => {
        const {
          _id,
          organization,
          organizationType,
          description,
          position,
        } = datum

        // For Outdated date formatting
        const formattedDescription = formatter
          ? formatter(description)
          : description

        const isActive = selectedOrganization._id === _id

        return (
          <ConnectionListItem
            key={_id}
            organizationType={organizationType}
            title={organization}
            subtitle={position}
            description={formattedDescription}
            value={datum}
            isActive={isActive}
            clickHandler={orgClickHandler}
            isDisabled={isDisabled}
          />
        )
      })}
    </Sublist>
  )
}

export default ConnectionsSublist
