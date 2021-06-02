import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_MARKET_BASKETS_SURVEYS_STAKEHOLDERS } from 'frontend/api/queries'

import UpdateStakeholder from './UpdateStakeholder'

const Stakeholders = () => {
  const { data: stakeholdersData, loading: stakeholdersLoading } = useQuery(
    GET_MARKET_BASKETS_SURVEYS_STAKEHOLDERS
  )

  if (stakeholdersLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>Stakeholders</h1>
      {stakeholdersData.marketBasketsSurveysStakeholders.map((stakeholder) => (
        <UpdateStakeholder key={stakeholder.id} stakeholder={stakeholder} />
      ))}
    </div>
  )
}

export default Stakeholders
