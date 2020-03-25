import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { GET_SINGLE_PAYER_PROJECT } from '../../../../api/queries'
import Spinner from '../../../../Phoenix/shared/Spinner'
import ProjectInfo from './ProjectInfo'
import ProjectContentConfiguration from './ProjectContentConfiguration'
import ConflictedTreatmentPlans from './ConflictedTreatmentPlans'

import Color from '../../../../utils/color'
import Spacing from '../../../../utils/spacing'

const Wrapper = styled.div({
  background: Color.WHITE,
  width: '100%',
})

const PayerProjectSetup = props => {
  const { projectId } = props.match.params

  const { data, loading } = useQuery(
    GET_SINGLE_PAYER_PROJECT,
    {
      variables: { projectId },
    })

  if (loading) return <Spinner />

  const { singlePayerProject: project } = data

  return (
    <Wrapper>
      <ProjectInfo name={project.name} />
      <ProjectContentConfiguration />
      <ConflictedTreatmentPlans />
    </Wrapper>
  )
}

PayerProjectSetup.propTypes = {
  
}

export default PayerProjectSetup