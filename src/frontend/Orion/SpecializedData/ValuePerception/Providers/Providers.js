import React from 'react'
import styled from '@emotion/styled'

import Header from 'frontend/components/Header'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

import ProvidersTable from './ProvidersTable'

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const TitleSection = styled.section({
  display: 'flex',
  padding: Spacing.S7,
  alignItems: 'center',
})

const Providers = () => {
  return (
    <Container>
      <TitleSection>
        <Header
          header="Providers"
          subheader="Select a table row to view and edit a Provider"
          headerStyle={{ ...FontSpace.FS5 }}
        />
      </TitleSection>
      <ProvidersTable />
    </Container>
  )
}

export default Providers
