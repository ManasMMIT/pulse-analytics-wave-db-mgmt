import React from 'react'

import FieldsSectionCard from '../../../../../components/FieldsSectionCard'

import { TABLE_HEADER_DATA } from './mock-data'

const fieldsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
}

// ! remove mock data
const TreatmentPlansFilters = () => {
  const fieldsConfig = TABLE_HEADER_DATA.map(item => ({
    ...item,
    inputComponent: 'Select',
    inputProps: {
      type: 'string',
      isMulti: true,
      placeholder: item.label,
      options: [
        { label: 'Aetna', value: 'aetna' },
        { label: 'Aetna 2', value: 'aetna-2' },
        { label: 'Aetna 3', value: 'aetna-3' },
      ],
    },
  }))

  return (
    <FieldsSectionCard
      label={'Filters'}
      fields={fieldsConfig}
      fieldStyle={{ width: 250, margin: 8 }}
      fieldsContainerStyle={fieldsContainerStyle}
    />
  )
}

export default TreatmentPlansFilters
