import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import _ from 'lodash'

import {
  GET_SINGLE_PAYER_PROJECT,
  GET_PAYER_PROJECT_PTPS,
} from 'frontend/api/queries'

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
      // ! fetchPolicy needed because PayerProjectTreatmentPlan updates 
      // ! for a single project but may affect other tables and 
      // ! no easy way to refresh cache for those other tables otherwise
      fetchPolicy: 'network-only',
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
