import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import {
  GET_EMAIL_DEVICE_METRICS,
  GET_OVERVIEW_METRICS,
} from '../../api/queries'
import DeviceMetric from './DeviceMetric'
import ClientMetrics from './ClientMetrics'
import OverviewMetrics from './OverviewMetrics'

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0 auto',
})

const EmailDashboardPanel = () => {
  const { data: deviceData, loading: deviceLoading } = useQuery(
    GET_EMAIL_DEVICE_METRICS
  )
  // const { data: clientData, loading: clientLoading } = useQuery(
  //   GET_CLIENT_METRICS
  // )

  const { data: overviewData, loading: overviewLoading } = useQuery(
    GET_OVERVIEW_METRICS,
  )
  if (deviceLoading || overviewLoading) return null
  // if (deviceLoading) return null

  return (
    <Wrapper>
      <DeviceMetric chartData={deviceData} />
      {/* <ClientMetrics chartData={clientData} /> */}
      <OverviewMetrics overviewData={overviewData} />
    </Wrapper>
  )
}

export default EmailDashboardPanel
