import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import TreatmentPlanManager from './TreatmentPlanManager'

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
    <TreatmentPlanManager
      indicationsWithRegimens={indicationsWithRegimens}
    />
  )
}

TreatmentPlanManagerContainer.propTypes = {
  data: PropTypes.array,
}

export default TreatmentPlanManagerContainer
