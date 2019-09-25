import React from 'react'
import PropTypes from 'prop-types'

const TreatmentPlanManager = ({ newTreatmentPlans }) => {
  return (
    <>
      <div>New treatment plans:</div>
      <div>
        {
          Object.keys(newTreatmentPlans).map(indication => {
            const indicationRegimens = newTreatmentPlans[indication]

            return indicationRegimens.map(({ name }) =>
              <div key={name}>
                <span style={{ paddingRight: 80 }}>{indication}</span>
                <span>{name}  </span>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

TreatmentPlanManager.propTypes = {
  newTreatmentPlans: PropTypes.object,
}

export default TreatmentPlanManager
