import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import Color from 'frontend/utils/color'
import { AlphaColors } from 'frontend/utils/pulseStyles'
import {
  formatDayMonthYearShort,
  formatDateMonthYearLong
} from 'frontend/utils/formatDate'
import { UnderlinedTabs } from 'frontend/components/Tabs'

import { GET_SINGLE_PAYER_PROJECT } from 'frontend/api/queries'
import TimestampCalendar from './TimestampCalendar'
import TimestampPanel from './TimestampPanel'

const Title = styled.h1({
  padding: Spacing.S7,
  ...FontSpace.FS4,
  borderBottom: `1px solid ${ AlphaColors.Black10 }`
})

const TABS_DATA = ['List', 'Calendar']

const SectionWrapper = styled.div({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  borderBottom: `1px solid ${ Color.LIGHT_GRAY_1 }`,
  overflowY: 'scroll'
})

const TimestampSection = ({
  projectId
}) => {
  const { data, loading } = useQuery(
    GET_SINGLE_PAYER_PROJECT,
    { variables: { projectId }}
  )

  let payerProjectTimestampsShort = []
  let payerProjectTimestampsLong = []

  if (!loading) {
    const sortedDates = data.singlePayerProject.timestamps.sort().reverse()
    payerProjectTimestampsShort = _.map(
      sortedDates,
      timestamp => formatDayMonthYearShort(timestamp)
    )

    payerProjectTimestampsLong = _.map(
      sortedDates,
      timestamp => formatDateMonthYearLong(timestamp)
    )
  }

  return (
    <SectionWrapper>
      <Title>Previous Imports by Timestamp</Title>
      <UnderlinedTabs
        tabsData={TABS_DATA}
        activeTabStyle={{ color: Color.PRIMARY }}
        tabsContainerStyle={{
          borderBottom: `1px solid ${ AlphaColors.Black10 }`,
          paddingLeft: Spacing.S4
        }}
      >
        <TimestampPanel timestamps={payerProjectTimestampsLong} />
        <TimestampCalendar timestamps={payerProjectTimestampsShort} />
      </UnderlinedTabs >
    </SectionWrapper>
  )
}

TimestampSection.propTypes = {
  projectId: PropTypes.string.isRequired,
}

export default TimestampSection
