import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { GET_PAYER_PROJECTS_LIST } from 'frontend/api/queries'
import Spinner from 'frontend/components/Spinner'
import { Colors, Spacing } from 'frontend/utils/pulseStyles'
import ProjectPlacard from './ProjectPlacard'
import CreateProjectButton from './CreateProjectButton'

const PlacardContainer = styled.div({
  display: 'flex',
  flexWrap: 'wrap', 
  backgroundColor: Colors.WHITE,
  borderRadius: 4,
})

const Wrapper = styled.div({
  margin: Spacing.NORMAL,
})

const Header = styled.div({
  margin: Spacing.NORMAL,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const generatePlacards = ({ _id, name, }) => {
  return (
    <ProjectPlacard
      key={_id}
      projectId={_id}
      projectName={name}
    />
  )
}

const PayerProjectsList = props => {
  const { data, loading } = useQuery(GET_PAYER_PROJECTS_LIST)
  if (loading) return <Spinner />

  return (
    <Wrapper>
      <Header>
        <div>
          Payer Projects
        </div>
        <CreateProjectButton/>
      </Header>
      <PlacardContainer>
        { data.payerProjectsList.map(generatePlacards)}
      </PlacardContainer>
    </Wrapper>
  )
}

export default PayerProjectsList
