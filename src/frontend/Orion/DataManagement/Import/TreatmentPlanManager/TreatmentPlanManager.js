import React from 'react'
import { Mutation } from 'react-apollo'
import PropTypes from 'prop-types'

import Spinner from './../../../../Phoenix/shared/Spinner'

import {
  BULK_CREATE_TREATMENT_PLAN,
} from './../../../../api/mutations'

const TreatmentPlanManager = ({ newTreatmentPlans }) => (
  <Mutation mutation={BULK_CREATE_TREATMENT_PLAN}>
    {(handleCreate, { loading, error }) => {
      if (error) return <div style={{ color: 'red' }}>Error processing request</div>
      if (loading) return <Spinner fill="white" />

      const handleSubmit = () => {
        handleCreate({
          variables: {
            input: { data: newTreatmentPlans }
          }
        })
      }
      return (
        <>
          <button onClick={handleSubmit}>CREATE ME</button>
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
    }}
  </Mutation>
)

TreatmentPlanManager.propTypes = {
  newTreatmentPlans: PropTypes.object,
}

export default TreatmentPlanManager
