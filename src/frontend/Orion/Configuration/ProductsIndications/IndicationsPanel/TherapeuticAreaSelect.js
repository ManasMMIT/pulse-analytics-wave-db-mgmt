import React from 'react'
import { useQuery } from '@apollo/client'
import Select from 'react-select'
import Spinner from 'frontend/components/Spinner'
import { customSelectStyles } from '../../../../components/customSelectStyles'

import { GET_THERAPEUTIC_AREAS } from '../../../../api/queries'

const TherapeuticAreaSelect = ({ therapeuticAreaId, handleChange }) => {
  const { data, loading } = useQuery(GET_THERAPEUTIC_AREAS)

  if (loading) return <Spinner />

  const options = data.therapeuticAreas.map(({ _id, name }) => ({
    value: _id,
    label: name,
  }))

  const selectedValue = options.find(({ value }) => value === therapeuticAreaId)

  return (
    <Select
      value={selectedValue}
      options={options}
      styles={customSelectStyles}
      // ! HACK: Mock HTML event.target structure to get therapeuticAreaId
      // ! able to written into Form's local state by handleChange
      onChange={({ value }) =>
        handleChange({ target: { name: 'therapeuticAreaId', value } })
      }
    />
  )
}

export default TherapeuticAreaSelect
