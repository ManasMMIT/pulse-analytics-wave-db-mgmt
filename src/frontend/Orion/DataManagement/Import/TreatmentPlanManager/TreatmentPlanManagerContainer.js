import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import _ from 'lodash'

import TreatmentPlanManager from './TreatmentPlanManager'
import Spinner from '../../../../Phoenix/shared/Spinner'

import {
  GET_NEW_TREATMENT_PLANS,
} from '../../../../api/queries'

const getIndicationsWithRegimens = data => {
  return data.reduce((indicationsObj, { indication, regimen }) => {
    if (!indicationsObj[indication]) indicationsObj[indication] = new Set([regimen])
    else indicationsObj[indication].add(regimen)

    return indicationsObj
  }, {})
}

const TreatmentPlanManagerContainer = ({ data }) => {
  if (_.isEmpty(data)) return null

  const hasTreatmentPlan = data.some(({ indication, regimen }) => indication && regimen)

  if (!hasTreatmentPlan) return null

  const indicationsWithRegimens = getIndicationsWithRegimens(data)

  for (const indication in indicationsWithRegimens) {
    indicationsWithRegimens[indication] = Array.from(indicationsWithRegimens[indication])
  }

  return (
    <Query query={GET_NEW_TREATMENT_PLANS} variables={{ data: indicationsWithRegimens }}>
      {({ data, loading, error }) => {
        if (error) return <div style={{ color: 'red' }}>Error processing request</div>
        if (loading) return <Spinner />

        if (_.isEmpty(data.newTreatmentPlans)) return null

        return (
          <TreatmentPlanManager
            newTreatmentPlans={data.newTreatmentPlans}
          />
        )
      }}
    </Query>
  )
}

TreatmentPlanManagerContainer.propTypes = {
  data: PropTypes.array,
}

export default TreatmentPlanManagerContainer
