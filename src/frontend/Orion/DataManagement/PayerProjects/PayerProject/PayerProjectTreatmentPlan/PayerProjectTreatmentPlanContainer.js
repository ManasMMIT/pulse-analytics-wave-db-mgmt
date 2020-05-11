import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import {
  GET_SINGLE_PAYER_PROJECT,
  GET_PAYER_PROJECT_PTPS,
} from '../../../../../api/queries'

import PayerProjectTreatmentPlan from './PayerProjectTreatmentPlan'
import { TABLE_HEADER_CONFIG } from './utils'

const PayerProjectTreatmentPlanContainer = () => {
  const { projectId } = useParams()

  const { data: ptps, loading: loadingPTPS } = useQuery(
    GET_PAYER_PROJECT_PTPS,
    {
      variables: {
        input: {
          projectId,
        },
      },
    }
  )

  const { data: payerOrgName, loading: loadingPayerOrg } = useQuery(
    GET_SINGLE_PAYER_PROJECT,
    {
      variables: { projectId },
    }
  )

  if (loadingPTPS || loadingPayerOrg) return null
  const { payerProjectPtps } = ptps
  const defaultFiltersObj = {}
  const filtersConfig = []

  TABLE_HEADER_CONFIG.forEach(({ value, label }) => {
    defaultFiltersObj[value] = { selectedOptions: [], valueSet: new Set([]) }

    const options = payerProjectPtps.reduce((acc, project) => {
      const projectValue = project[value]
      acc.add(projectValue)
      return acc
    }, new Set([]))

    const formattedOptions = Array.from(options).map(option => ({
      value: option,
      label: option,
    }))

    const sortedOptions = _.sortBy(formattedOptions, 'label')

    filtersConfig.push({
      value,
      label,
      options: sortedOptions,
    })
  })

  return (
    <PayerProjectTreatmentPlan
      data={payerProjectPtps}
      defaultFilters={defaultFiltersObj}
      filtersConfig={filtersConfig}
      payerOrg={payerOrgName.singlePayerProject.name}
    />
  )
}

export default PayerProjectTreatmentPlanContainer
