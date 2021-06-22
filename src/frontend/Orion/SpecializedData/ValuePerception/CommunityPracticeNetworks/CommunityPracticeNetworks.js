import React, { useState } from 'react'
import styled from '@emotion/styled'

import { Button } from '@pulse-analytics/pulse-design-system'

import Header from 'frontend/components/Header'
import Caption from 'frontend/components/Caption'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

import CpnTable from './CpnTable'
import CreateCpnForm from './CreateCpnForm'

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

const ButtonSection = styled.section({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `0 ${Spacing.S7}`,
  alignItems: 'center',
})

const CommunityPracticeNetworks = () => {
  const [isModalOpen, setModal] = useState(false)

  return (
    <Container>
      <TitleSection>
        <Header
          header="Community Practice Network"
          subheader="Select a table row to view and edit a Community Practice Network"
          headerStyle={{ ...FontSpace.FS5 }}
        />
      </TitleSection>
      <ButtonSection>
        <Caption>
          Click a Community Practice Network row to edit or delete a Network
        </Caption>
        <Button
          onClick={() => setModal(true)}
          style={{
            padding: `${Spacing.S2} ${Spacing.S3}`,
            margin: `${Spacing.S4} 0`,
          }}
        >
          + Create Community Practice Network
        </Button>
      </ButtonSection>
      <CpnTable />
      {isModalOpen && <CreateCpnForm closeHandler={() => setModal(false)} />}
    </Container>
  )
}

export default CommunityPracticeNetworks
