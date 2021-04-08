import React from 'react'
import Select from 'react-select'
import _ from 'lodash'

import { FormLabel } from '../../../../Organizations/styledComponents'

const PART_ORDER = {
  indications: 0,
  regimens: 1,
  population: 2,
  line: 3,
  book: 4,
  coverage: 5,
}

const getSelectDropdowns = ([state, setState], treatmentPlanParts) => {
  const sortedEntries = _.sortBy(
    Object.entries(treatmentPlanParts),
    ([part]) => PART_ORDER[part]
  )

  return sortedEntries.map(([part, data]) => {
    const partSingular = part.slice(0, part.length - 1)

    const dropdownOptions = data.map((datum) => ({
      label: datum.name,
      value: datum,
    }))

    let selectedValue = null
    if (state[partSingular]) {
      selectedValue = {
        value: state[partSingular],
        label: state[partSingular].name,
      }
    }

    return (
      <div key={`${part}-dropdown`} style={{ padding: 12 }}>
        <FormLabel>{partSingular}</FormLabel>
        <Select
          defaultValue={dropdownOptions[0]}
          value={selectedValue}
          options={dropdownOptions}
          onChange={({ value }) => {
            setState({ ...state, [partSingular]: value })
          }}
        />
      </div>
    )
  })
}

const TreatmentPlanForm = ({ treatmentPlanParts, stateHook }) => {
  const selectDropdowns = getSelectDropdowns(stateHook, treatmentPlanParts)

  return <div>{selectDropdowns}</div>
}

export default TreatmentPlanForm
