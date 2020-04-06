import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import Select from 'react-select'

import { GET_SOURCE_TREATMENT_PLANS } from '../../../api/queries'
import { customSelectStyles } from './../../../components/customSelectStyles'

import ExportCombinedStateLivesButton from './ExportCombinedStateLivesButton'

import {
  SectionContainer,
  SectionHeader,
  SelectLabel,
} from './styledComponents'

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
    <SectionContainer>
      <SectionHeader>Regional Targeting Export</SectionHeader>

      <div style={{ marginTop: 24 }}>
        <SelectLabel>Select a treatment plan:</SelectLabel>
        <Select
          value={{ value: selectedTreatmentPlan, label: getTpLabel(selectedTreatmentPlan) }}
          onChange={({ value }) => selectTreatmentPlan(value)}
          options={treatmentPlansOptions}
          styles={customSelectStyles}
        />

        <ExportCombinedStateLivesButton
          treatmentPlan={selectedTreatmentPlan}
        />
      </div>

    </SectionContainer>
  )
}

export default ExportRegionalBreakdown
