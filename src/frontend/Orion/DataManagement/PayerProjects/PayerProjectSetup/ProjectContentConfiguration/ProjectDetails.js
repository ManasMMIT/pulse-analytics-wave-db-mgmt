import React from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@apollo/react-hooks'

import { GET_PROJECT_PTPS } from '../../../../../api/queries'

import ProjectDetailsPanel from './ProjectDetailsPanel'
import Spinner from '../../../../../Phoenix/shared/Spinner'

import Spacing from '../../../../../utils/spacing'

const Wrapper = styled.div({
  display: 'flex',
  'div': { marginRight: Spacing.S7 },
  'div:last-child': { marginRight: 0 }
})

const ProjectDetails = ({ projectId }) => {
  const { data, loading } = useQuery(
    GET_PROJECT_PTPS,
    {
      variables: { 
        input: { projectId } 
      },
    })

  if (loading) return <Spinner />

  const panelConfig = data.projectPtps.reduce((result, treatmentPlan) => {
    const { organizationTiny, indication, regimen } = treatmentPlan

    result.payers.add(organizationTiny)
    result.indications.add(indication)
    result.regimens.add(regimen)

    return result
  }, { payers: new Set(), indications: new Set(), regimens: new Set() })

  return (
    <Wrapper>
      {
        Object.entries(panelConfig).map(panel => {
          const [name, values] = panel
          const valuesArr = [...values].sort()

          return <ProjectDetailsPanel name={name} values={valuesArr}/>
        })
      }
    </Wrapper>
  )
}

export default ProjectDetails