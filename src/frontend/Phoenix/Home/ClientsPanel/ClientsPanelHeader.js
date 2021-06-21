import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

const phoenixLogo =
  'https://res.cloudinary.com/pulsedatatools/image/upload/v1573837414/polaris/icons/phoenix-1-color.svg'

const PhoenixHeader = styled.div({
  alignItems: 'center',
  background: transparentize(0.3, Color.BLACK),
  color: Color.PHOENIX,
  display: 'flex',
  fontSize: 12,
  fontWeight: 700,
  padding: `${Spacing.S5} ${Spacing.S7}`,
  textTransform: 'uppercase',
  width: '100%',
})

const PhoenixLogo = styled.img({
  display: 'inline',
  marginRight: Spacing.S3,
})

const ClientsPanelHeader = () => {
  return (
    <PhoenixHeader>
      <PhoenixLogo src={phoenixLogo} />
      Phoenix User MGMT
    </PhoenixHeader>
  )
}

export default ClientsPanelHeader
