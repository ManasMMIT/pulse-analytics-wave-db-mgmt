import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import _ from 'lodash'

import ProjectPlacard from './ProjectPlacard'
import CreateProjectButton from './CreateProjectButton'
import Title from '../../../../components/Title'
import Spinner from '../../../../Phoenix/shared/Spinner'

import { GET_PAYER_PROJECTS_LIST } from '../../../../api/queries'
import Color from '../../../../utils/color'
import Spacing from '../../../../utils/spacing'

const PlacardContainer = styled.div({
  display: 'flex',
  flexWrap: 'wrap', 
  backgroundColor: Color.WHITE,
  borderRadius: 4,
  padding: Spacing.S4,
})

const Wrapper = styled.div({
  margin: Spacing.S4,
})

const Header = styled.div({
  margin: Spacing.S4,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const generatePlacards = ({ _id, name, timestamps }) => {
  return (
    <ProjectPlacard
      key={_id}
      projectId={_id}
      projectName={name}
      timestamps={timestamps}
    />
  )
}

const PayerProjectsList = props => {
  const { data, loading } = useQuery(GET_PAYER_PROJECTS_LIST)
  if (loading) return <Spinner />

  const sortedProjects = _.sortBy(data.payerProjectsList, ['name'])
  return (
    <Wrapper>
      <Header>
        <Title title="Payer Projects"/>
        <CreateProjectButton/>
      </Header>
      <PlacardContainer>
        { sortedProjects.map(generatePlacards)}
      </PlacardContainer>
    </Wrapper>
  )
}

export default PayerProjectsList
