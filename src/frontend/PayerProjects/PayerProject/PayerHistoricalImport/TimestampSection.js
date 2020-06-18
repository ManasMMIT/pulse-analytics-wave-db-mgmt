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

import {
  GET_SINGLE_PAYER_PROJECT,
  GET_PAYER_PROJECT_IMPORT_TIMESTAMPS,
} from 'frontend/api/queries'
import TimestampCalendar from './TimestampCalendar'
import TimestampPanel from './TimestampPanel'

const Title = styled.h1({
  padding: Spacing.S7,
  ...FontSpace.FS4,
  borderBottom: `1px solid ${ AlphaColors.Black10 }`
})

const TABS_DATA = ['Import Timeline', 'Import Calendar', 'PTP Timeline']

const SectionWrapper = styled.div({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  borderBottom: `1px solid ${ Color.LIGHT_GRAY_1 }`,
})

const TimestampSection = ({
  projectId
}) => {
  const { data: importTimestampData, loading: loadingImportData } = useQuery(
    GET_PAYER_PROJECT_IMPORT_TIMESTAMPS,
    { variables: { projectId }}
  )

  const { data: ptpData, loading: loadingPtpData } = useQuery(
    GET_SINGLE_PAYER_PROJECT,
    { variables: { projectId } }
  )

  const [
    importTimestampsLong,
    importTimestampsShort
  ] = getShortAndLongTimestamps(loadingImportData, importTimestampData)

  const [ptpTimestampsLong] = getShortAndLongTimestamps(loadingPtpData, ptpData)

  return (
    <SectionWrapper>
      <Title>Previous Imports by Timestamp</Title>
      <UnderlinedTabs
        tabsData={TABS_DATA}
        activeTabStyle={{ color: Color.PRIMARY }}
        tabsContainerStyle={{
          borderBottom: `1px solid ${ AlphaColors.Black10 }`,
          paddingLeft: Spacing.S4,
        }}
      >
        <TimestampPanel timestamps={_.uniq(importTimestampsLong)} />
        <TimestampCalendar timestamps={_.uniq(importTimestampsShort)} />
        <TimestampPanel timestamps={_.uniq(ptpTimestampsLong)} />
      </UnderlinedTabs >
    </SectionWrapper>
  )
}

TimestampSection.propTypes = {
  projectId: PropTypes.string.isRequired,
}

export default TimestampSection

const getShortAndLongTimestamps = (loading, data) => {
  let payerProjectTimestampsShort = []
  let payerProjectTimestampsLong = []

  if (!loading) {
    const timestamps = Object.values(data)[0] && Object.values(data)[0].timestamps
    if (!timestamps) return [payerProjectTimestampsLong, payerProjectTimestampsShort]

    const sortedDates = timestamps.sort().reverse()
    payerProjectTimestampsShort = _.map(sortedDates, timestamp => formatDayMonthYearShort(timestamp))
    payerProjectTimestampsLong = _.map(sortedDates, timestamp => formatDateMonthYearLong(timestamp))
  }

  return [payerProjectTimestampsLong, payerProjectTimestampsShort]
}
