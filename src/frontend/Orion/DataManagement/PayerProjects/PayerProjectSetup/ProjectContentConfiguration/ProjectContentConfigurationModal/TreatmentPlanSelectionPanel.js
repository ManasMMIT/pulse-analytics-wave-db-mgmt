import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import {
  GET_SOURCE_TREATMENT_PLANS,
} from '../../../../../../api/queries'

const TreatmentPlanSelectionPanel = ({
  setTreatmentPlanIds,
}) => {
  const { data, loading } = useQuery(GET_SOURCE_TREATMENT_PLANS)

  if (loading) return 'Loading'

  const { treatmentPlans } = data

  return null
}

export default TreatmentPlanSelectionPanel
