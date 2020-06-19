import React from 'react'
import styled from '@emotion/styled'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

const Wrapper = styled.div({
  width: '100%',
  padding: Spacing.S7,
  background: Color.WHITE,
  color: Color.BLACK,
})
const Title = styled.div({
  fontWeight: 700,
  ...FontSpace.FS4,
})

const ClientMetrics = () => {
  const two = 3

  return (
    <Wrapper>
      <Title>Client Metrics</Title>
    </Wrapper>
  )
}

export default ClientMetrics
