import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { GET_PAYER_PROJECTS_LIST } from '../../../../api/queries'
import Spinner from '../../../../Phoenix/shared/Spinner'
import { Colors, Spacing } from '../../../../utils/pulseStyles'
import ProjectPlacard from './ProjectPlacard'

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
      <Header>Payer Projects</Header>
      <PlacardContainer>
        { data.payerProjectsList.map(generatePlacards)}
      </PlacardContainer>
    </Wrapper>
  )
}

export default PayerProjectsList
