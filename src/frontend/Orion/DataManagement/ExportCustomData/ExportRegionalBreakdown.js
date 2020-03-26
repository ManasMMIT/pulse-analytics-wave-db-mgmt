import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import Select from 'react-select'

import { GET_SOURCE_TREATMENT_PLANS } from '../../../api/queries'

import ExportCombinedStateLivesButton from './ExportCombinedStateLivesButton'

const ExportRegionalBreakdown = () => {
  const [selectedTreatmentPlan, selectTreatmentPlan] = useState({})
  const { data, loading } = useQuery(GET_SOURCE_TREATMENT_PLANS)

  useEffect(() => {
    if (!loading) selectTreatmentPlan(data.treatmentPlans[0])
  }, [loading])

  if (loading) return 'Loading'

  const getTpLabel = tp => (
    [tp.indication, tp.regimen, tp.population, tp.line, tp.book, tp.coverage].join(' | ')
  )

  const treatmentPlansOptions = data.treatmentPlans.map(tp => ({
    label: getTpLabel(tp),
    value: tp,
  }))

  return (
    <div style={{ border: '1px solid black', padding: 24 }}>
      <div>DOWNLOAD REGIONAL TARGETING DATA</div>

      <div style={{ marginTop: 24 }}>
        <div>Select a treatment plan:</div>
        <Select
          value={{ value: selectedTreatmentPlan, label: getTpLabel(selectedTreatmentPlan) }}
          onChange={({ value }) => selectTreatmentPlan(value)}
          options={treatmentPlansOptions}
        />

        <ExportCombinedStateLivesButton
          treatmentPlan={selectedTreatmentPlan}
        />
      </div>

    </div>
  )
}

export default ExportRegionalBreakdown
