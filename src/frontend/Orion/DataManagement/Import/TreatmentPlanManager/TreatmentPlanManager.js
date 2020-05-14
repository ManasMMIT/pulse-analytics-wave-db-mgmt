import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import _ from 'lodash'

import CreateTreatmentPlansButton from './CreateTreatmentPlansButton'
import ErrorList from './../ErrorList'
import Spinner from 'frontend/components/Spinner'

import {
  GET_NEW_TREATMENT_PLANS,
} from '../../../../api/queries'

const TITLE = 'NEW TREATMENT PLANS DETECTED'

const ROW_CONFIG = [
  { key: 'indication', color: 'black' },
  { key: 'regimen', color: 'black' },
]

const TreatmentPlanManager = ({ indicationsWithRegimens }) => {
  const { data, loading, error } = useQuery(
    GET_NEW_TREATMENT_PLANS,
    { variables: { data: indicationsWithRegimens } },
  )

  if (error) {
    return <div style={{ color: 'red' }}>Error processing request</div>
  }

  if (loading) return <Spinner fill="white" />

  if (_.isEmpty(data) || _.isEmpty(data.newTreatmentPlans)) return null

  const { newTreatmentPlans } = data

  const formattedNewTreatmentPlans = Object.keys(newTreatmentPlans)
    .reduce((flattenedTreatmentPlans, indication) => {
      const regimens = newTreatmentPlans[indication]

      const treatmentPlanPairs = regimens
        .map(regimen => ({ indication, regimen: regimen.name }))

      return flattenedTreatmentPlans.concat(treatmentPlanPairs)
    }, [])

  return (
    <ErrorList
      title={TITLE}
      subtitle={<CreateTreatmentPlansButton newTreatmentPlans={newTreatmentPlans} />}
      headers={['Indication', 'Regimen']}
      data={formattedNewTreatmentPlans}
      rowConfig={ROW_CONFIG}
      errorColor={'#ffff001a'}
    />
  )
}

TreatmentPlanManager.propTypes = {
  newTreatmentPlans: PropTypes.object,
}

export default TreatmentPlanManager
