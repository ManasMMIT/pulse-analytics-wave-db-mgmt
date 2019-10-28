import React from 'react'
import styled from '@emotion/styled'

import EmailAlerts from './EmailAlerts'
import EmailUsers from './EmailUsers'

const Page = styled.div({
  padding: 24,
  backgroundColor: '#e8ebec',
  flex: 1,
  height: '100vh',
  boxSizing: 'border-box',
  overflow: 'auto',
})

const Delphi = () => {
  return (
    <Page>
      <EmailAlerts />
      <EmailUsers />
    </Page>
  )
}

export default Delphi