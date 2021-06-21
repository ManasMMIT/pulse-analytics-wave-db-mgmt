import React, { useState } from 'react'
import styled from '@emotion/styled'

import { Button } from '@pulse-analytics/pulse-design-system'

import Header from 'frontend/components/Header'
import Caption from 'frontend/components/Caption'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

import RoleTypePowerSelect from './RoleTypePowerSelect'
import RolesTable from './RolesTable'
import CreateRoleForm from './CreateRoleForm'

const Container = styled.div({
  padding: Spacing.S7,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const TitleSection = styled.section({
  display: 'flex',
  padding: `0 ${Spacing.S4}`,
  alignItems: 'center',
  justifyContent: 'space-between',
})

const ButtonSection = styled.section({
  display: 'flex',
  justifyContent: 'space-between',
  padding: Spacing.S4,
  alignItems: 'center',
})

const Roles = () => {
  const [isModalOpen, setModal] = useState(false)

  return (
    <Container>
      <TitleSection>
        <Header
          header="Roles"
          subheader="Select a table row to view and edit a Role"
          headerStyle={{ ...FontSpace.FS5 }}
        />
        <RoleTypePowerSelect />
      </TitleSection>
      <ButtonSection>
        <Caption>Click a role row to edit or delete a role</Caption>
        <Button
          onClick={() => setModal(true)}
          style={{
            padding: `${Spacing.S2} ${Spacing.S3}`,
            margin: `${Spacing.S4} 0`,
          }}
        >
          + Create Role
        </Button>
      </ButtonSection>
      <RolesTable />
      {isModalOpen && <CreateRoleForm closeHandler={() => setModal(false)} />}
    </Container>
  )
}

export default Roles
