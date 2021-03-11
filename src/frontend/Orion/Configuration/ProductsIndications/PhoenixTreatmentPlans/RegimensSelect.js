import React from 'react'
import { useQuery } from '@apollo/client'
import Select from 'react-select'
import _ from 'lodash'
import Spinner from 'frontend/components/Spinner'
import stripTypename from '../../../shared/strip-typename'

import { customSelectStyles } from '../../../../components/customSelectStyles'

import {
  GET_SOURCE_REGIMENS,
} from '../../../../api/queries'

const RegimensSelect = ({ state, handleChange }) => {
  const { data, loading, error } = useQuery(GET_SOURCE_REGIMENS)

  if (error) return <div style={{ color: 'red' }}>Error processing request</div>
  if (loading) return <Spinner />

  const { regimens } = data

  // TODO: also make searchable by products and their tags, not just regimen name
  const initialSelections = state.input.regimens.map(({ _id, name }) => (
    { value: _id, label: name }
  ))

  const regimensByKey = _.keyBy(regimens, '_id')

  // TODO: also make searchable by products and their tags, not just regimen name
  const options = regimens.map(({ _id, name }) => (
    { value: _id, label: name }
  ))

  return (
    <Select
      defaultValue={initialSelections}
      isMulti
      options={options}
      styles={customSelectStyles}
      onChange={arrOfVals => {
        let newRegimens = arrOfVals || []

        newRegimens = newRegimens.map(
          ({ value }) => stripTypename(regimensByKey[value])
        )

        // ! HACK: Mock HTML event.target structure to get tags
        // ! able to written into TextForm's local state by handleChange
        handleChange({ target: { name: 'regimens', value: newRegimens } })
      }}
    />
  )
}

export default RegimensSelect
