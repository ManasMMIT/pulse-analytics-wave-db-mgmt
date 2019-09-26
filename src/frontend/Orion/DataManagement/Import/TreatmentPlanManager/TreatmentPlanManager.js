import React from 'react'
import { Mutation } from 'react-apollo'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

import ErrorList from './../ErrorList'
import Spinner from './../../../../Phoenix/shared/Spinner'

import {
  BULK_CREATE_TREATMENT_PLAN,
} from './../../../../api/mutations'

const TITLE = 'NEW TREATMENT PLANS DETECTED'

const SUBTITLE = `The following Treatment Plans don't exist. Create them so they can be used in the application.`

const ROW_CONFIG = [
  { key: 'indication', color: 'black' },
  { key: 'regimen', color: 'black' },
]

const Button = styled.button({
  border: 'none',
  background: '#006aff',
  color: 'white',
  fontWeight: 700,
  padding: 6,
  borderRadius: 3,
  marginTop: 12,
}, style => ({ ...style }))

const TreatmentPlanManager = ({ newTreatmentPlans }) => (
  <Mutation mutation={BULK_CREATE_TREATMENT_PLAN}>
    {(handleCreate, { loading, error }) => {
      if (error) return <div style={{ color: 'red' }}>Error processing request</div>
      if (loading) return <Spinner fill="white" />

      const handleSubmit = (e) => {
        handleCreate({
          variables: {
            input: { data: newTreatmentPlans }
          }
        })
      }

      const data = Object.keys(newTreatmentPlans)
        .reduce((flattenedTreatmentPlans, indication) => {
        const regimens = newTreatmentPlans[indication]

        const treatmentPlanPairs = regimens
          .map(regimen => ({ indication, regimen: regimen.name }))

        return flattenedTreatmentPlans.concat(treatmentPlanPairs)
      }, [])

      const subtitle = (
        <>
          <div>{SUBTITLE}</div>
          <Button onClick={handleSubmit}>Create Plans</Button>
        </>
      )

      return (
        <>
          <ErrorList
            title={TITLE}
            subtitle={subtitle}
            headers={['Indication', 'Regimen']}
            data={data}
            rowConfig={ROW_CONFIG}
            errorColor={'#ffff001a'}
          />
        </>
      )
    }}
  </Mutation>
)

TreatmentPlanManager.propTypes = {
  newTreatmentPlans: PropTypes.object,
}

export default TreatmentPlanManager
