import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { GET_PAYER_PROJECTS_LIST } from 'frontend/api/queries'
import Spinner from 'frontend/components/Spinner'
import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import ProjectPlacard from './ProjectPlacard'
import CreateProjectButton from './CreateProjectButton'
import AdminLivesImportButton from './AdminLivesImportButton'

const PlacardContainer = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  backgroundColor: Color.WHITE,
  borderRadius: 4,
})

const Wrapper = styled.div({
  margin: Spacing.S4,
})

const Header = styled.div({
  margin: Spacing.S4,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 700,
})

const generatePlacards = ({ _id, name }) => {
  return <ProjectPlacard key={_id} projectId={_id} projectName={name} />
}

const PayerProjectsList = (props) => {
  const { data, loading } = useQuery(GET_PAYER_PROJECTS_LIST)

  if (loading) return <Spinner />

  return (
    <Wrapper>
      <Header>
        <div>Payer Projects</div>
        <div>
          <AdminLivesImportButton />
          <CreateProjectButton />
        </div>
      </Header>
      <PlacardContainer>
        {data.payerProjectsList.map(generatePlacards)}
      </PlacardContainer>
    </Wrapper>
  )
}

export default PayerProjectsList
