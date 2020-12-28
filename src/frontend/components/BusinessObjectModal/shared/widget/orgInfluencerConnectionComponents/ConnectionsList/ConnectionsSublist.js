import React from 'react'

import Sublist from 'frontend/components/List/Sublist'
import SublistHeaderRow from 'frontend/components/List/SublistHeaderRow'

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
  selectedConnection,
  ConnectionListItem,
  clickHandler,
}) => {
  const { rowColor, formatter, isDisabled } = SUBLIST_MAP[status]

  return (
    <Sublist>
      <SublistHeaderRow
        text={`${status} (${data.length})`}
        rowColor={rowColor}
      />
      {data.map((datum) => {
        const isActive = selectedConnection._id === datum._id

        return (
          <ConnectionListItem
            key={datum._id}
            value={datum}
            formatter={formatter}
            isActive={isActive}
            clickHandler={clickHandler}
            isDisabled={isDisabled}
          />
        )
      })}
    </Sublist>
  )
}

export default ConnectionsSublist
