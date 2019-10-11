import React from 'react'
import styled from '@emotion/styled'

import PushToDevButton from './PushToDevButton'
import PushToProdButton from './PushToProdButton'

const Wrapper = styled.div({
  flex: 1,
  padding: 24,
  overflowY: 'scroll',
  backgroundColor: '#0a3557',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
})

const StatusPanel = () => (
  <Wrapper>
    <PushToDevButton />
    <PushToProdButton />
  </Wrapper>
)

export default StatusPanel
