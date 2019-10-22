import React from 'react'
import styled from '@emotion/styled'

import EmailAlerts from './EmailAlerts'

const Page = styled.div({
  padding: 24,
  backgroundColor: '#e8ebec',
  flex: 1,
  height: '100vh',
  boxSizing: 'border-box',
})

const Delphi = () => {
  return (
    <Page>
      <EmailAlerts />
    </Page>
  )
}

export default Delphi