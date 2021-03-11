import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import _ from 'lodash'
import { transparentize } from 'polished'

import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import Color from 'frontend/utils/color'
import { AlphaColors } from 'frontend/utils/pulseStyles'
import { formatDayMonthYearShort, formatDateMonthYearLong } from 'frontend/utils/formatDate'
import { UnderlinedTabs } from 'frontend/components/Tabs'

import { GET_SINGLE_PAYER_PROJECT, GET_PAYER_PROJECT_IMPORT_TIMESTAMPS } from 'frontend/api/queries'
import TimestampCalendar from './TimestampCalendar'
import TimestampPanel from './TimestampPanel'

const Title = styled.h1({
  padding: Spacing.S6,
  ...FontSpace.FS4,
})

const HelpLink = styled.a({
  margin: '0 24px',
  padding: '8px 12px',
  color: Color.MEDIUM_GRAY_2,
  fontSize: 12,
  fontWeight: 800,
  background: transparentize(0.85, Color.MEDIUM_GRAY_2),
  borderRadius: 4,
  ':hover': {
    background: transparentize(0.7, Color.MEDIUM_GRAY_2),
  },
})

const TABS_DATA = ['Project Timeline', 'Project Calendar', 'PTP Timeline']

const SectionWrapper = styled.div({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  borderBottom: `1px solid ${Color.LIGHT_GRAY_1}`,
})

const TimestampSection = ({ projectId }) => {
  const { data: importTimestampData, loading: loadingImportData } = useQuery(
    GET_PAYER_PROJECT_IMPORT_TIMESTAMPS,
    {
      variables: { projectId },
    }
  )

  const { data: ptpData, loading: loadingPtpData } = useQuery(GET_SINGLE_PAYER_PROJECT, {
    variables: { projectId },
  })

  const [importTimestampsLong, importTimestampsShort] = getShortAndLongTimestamps(
    loadingImportData,
    importTimestampData
  )

  const [ptpTimestampsLong] = getShortAndLongTimestamps(loadingPtpData, ptpData)

  return (
    <SectionWrapper>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${AlphaColors.Black10}`,
        }}
      >
        <Title>Previous Imports by Timestamp</Title>
        <HelpLink
          href="https://dedhamgroup.atlassian.net/servicedesk/customer/portal/2/article/1213792275"
          target="_blank"
        >
          How to Import Guide
        </HelpLink>
      </div>
      <UnderlinedTabs
        tabsData={TABS_DATA}
        activeTabStyle={{ color: Color.PRIMARY }}
        tabsContainerStyle={{
          borderBottom: `1px solid ${AlphaColors.Black10}`,
          paddingLeft: Spacing.S4,
        }}
      >
        <TimestampPanel timestamps={importTimestampsLong} />
        <TimestampCalendar timestamps={importTimestampsShort} />
        <TimestampPanel timestamps={ptpTimestampsLong} />
      </UnderlinedTabs>
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
    payerProjectTimestampsShort = _.map(sortedDates, (timestamp) =>
      formatDayMonthYearShort(timestamp)
    )
    payerProjectTimestampsLong = _.map(sortedDates, (timestamp) =>
      formatDateMonthYearLong(timestamp)
    )
  }

  return [payerProjectTimestampsLong, payerProjectTimestampsShort]
}
