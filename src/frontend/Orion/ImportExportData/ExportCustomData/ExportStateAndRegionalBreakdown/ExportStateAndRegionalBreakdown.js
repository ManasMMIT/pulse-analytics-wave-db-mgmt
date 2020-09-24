import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import Select from 'react-select'

import { GET_SOURCE_TREATMENT_PLANS, GET_TEAMS } from '../../../../api/queries'
import { customSelectStyles } from '../../../../components/customSelectStyles'

import ExportButtons from './ExportButtons'
import Spinner from 'frontend/components/Spinner'

import {
  SectionContainer,
  SectionHeader,
  SelectLabel,
} from '../../styledComponents'

const getTpLabel = (obj) =>
  [
    obj.indication,
    obj.regimen,
    obj.population,
    obj.line,
    obj.book,
    obj.coverage,
  ].join(' | ')

const ExportRegionalBreakdown = () => {
  const [selectedTreatmentPlan, selectTreatmentPlan] = useState({})
  const [selectedTeam, selectTeam] = useState({})
  const [selectedLivesSource, selectLivesSource] = useState('DRG')

  const { loading: treatmentPlansLoading, data: treatmentPlansData } = useQuery(
    GET_SOURCE_TREATMENT_PLANS
  )

  const { loading: teamsLoading, data: teamsData } = useQuery(GET_TEAMS)

  useEffect(() => {
    if (!teamsLoading) selectTeam(teamsData.teams[0])
    if (!treatmentPlansLoading)
      selectTreatmentPlan(treatmentPlansData.treatmentPlans[0])
  }, [treatmentPlansLoading, teamsLoading])

  let teamsDropdownOptions
  if (!teamsLoading) {
    const { teams } = teamsData

    teamsDropdownOptions = teams.map((team) => ({
      value: team,
      label: `Client: ${team.client.name} | Team: ${team.name}`,
    }))
  }

  let treatmentPlansOptions
  if (!treatmentPlansLoading) {
    const { treatmentPlans } = treatmentPlansData

    treatmentPlansOptions = treatmentPlans.map((treatmentPlan) => ({
      label: getTpLabel(treatmentPlan),
      value: treatmentPlan,
    }))
  }

  return (
    <SectionContainer>
      <SectionHeader>Regional Targeting Export</SectionHeader>
      <div style={{ marginTop: 24 }}>
        <SelectLabel>Select a team:</SelectLabel>
        {teamsLoading ? (
          <Spinner />
        ) : (
          <Select
            value={{
              value: selectedTeam,
              label: `Client: ${
                selectedTeam.client && selectedTeam.client.name
              } | Team: ${selectedTeam.name}`,
            }}
            onChange={({ value }) => selectTeam(value)}
            options={teamsDropdownOptions}
            styles={customSelectStyles}
          />
        )}

        <SelectLabel style={{ marginTop: 16 }}>
          Select a treatment plan:
        </SelectLabel>
        {treatmentPlansLoading ? (
          <Spinner />
        ) : (
          <Select
            value={{
              value: selectedTreatmentPlan,
              label: getTpLabel(selectedTreatmentPlan),
            }}
            onChange={({ value }) => selectTreatmentPlan(value)}
            options={treatmentPlansOptions}
            styles={customSelectStyles}
          />
        )}

        <SelectLabel style={{ marginTop: 16 }}>
          Select a lives source:
        </SelectLabel>
        <Select
          isDisabled
          value={{
            value: selectedLivesSource,
            label: selectedLivesSource,
          }}
          onChange={({ value }) => selectLivesSource(value)}
          options={[
            { value: 'DRG', label: 'DRG' },
            { value: 'MMIT', label: 'MMIT' },
          ]}
          styles={customSelectStyles}
        />

        <ExportButtons
          treatmentPlan={selectedTreatmentPlan}
          selectedTeamId={selectedTeam._id}
          selectedLivesSource={selectedLivesSource}
        />
      </div>
    </SectionContainer>
  )
}

export default ExportRegionalBreakdown
