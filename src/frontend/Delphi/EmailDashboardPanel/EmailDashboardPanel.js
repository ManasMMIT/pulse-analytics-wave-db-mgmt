import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { GET_EMAIL_DEVICE_METRICS } from '../../api/queries'
import DeviceMetric from './DeviceMetric'

const Wrapper = styled.div({
  display: 'flex',
  flex: '1 0 auto',
})

const EmailDashboardPanel = () => {
  const { data, loading, error } = useQuery(GET_EMAIL_DEVICE_METRICS)

  if (loading) return null

  return (
    <Wrapper>
      <DeviceMetric chartData={data} />
    </Wrapper>
  )
}

export default EmailDashboardPanel
