import React, { useState } from 'react'
import styled from '@emotion/styled'

import { Button } from '@pulse-analytics/pulse-design-system'

import Header from 'frontend/components/Header'
import Caption from 'frontend/components/Caption'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

import InstitutionsTable from './InstitutionsTable'
import CreateInstitutionForm from './CreateInstitutionForm'

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

const Institutions = () => {
  const [isModalOpen, setModal] = useState(false)

  return (
    <Container>
      <TitleSection>
        <Header
          header="Institutions"
          subheader="Select a table row to view and edit an Institution"
          headerStyle={{ ...FontSpace.FS5 }}
        />
      </TitleSection>
      <ButtonSection>
        <Caption>
          Click a Institution row to edit or delete an Institution
        </Caption>
        <Button
          onClick={() => setModal(true)}
          style={{
            padding: `${Spacing.S2} ${Spacing.S3}`,
            margin: `${Spacing.S4} 0`,
          }}
        >
          + Create Institution
        </Button>
      </ButtonSection>
      <InstitutionsTable />
      {isModalOpen && (
        <CreateInstitutionForm closeHandler={() => setModal(false)} />
      )}
    </Container>
  )
}

export default Institutions
