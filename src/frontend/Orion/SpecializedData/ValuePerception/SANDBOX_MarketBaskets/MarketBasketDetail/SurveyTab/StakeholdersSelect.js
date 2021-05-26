import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import Select from 'react-select'

import { GET_VEGA_PEOPLE } from 'frontend/api/queries'

const SEARCH_BAR_PLACEHOLDER_TEXT = 'Select...'

const StakeholdersSelect = ({ surveyId, stakeholders, updateStakeholders }) => {
  const [searchOptions, setSearchOptions] = useState([])

  const { data, loading } = useQuery(GET_VEGA_PEOPLE)

  const addStakeholder = ({ value }) => {
    const newStakeholders = [...stakeholders, value]
    updateStakeholders({
      variables: {
        input: {
          id: surveyId,
          stakeholders: newStakeholders,
        },
      },
    })
  }

  useEffect(() => {
    if (!loading) {
      const newSearchOptions = data.vegaPeople.map((person) => ({
        label: `${person.first_name} ${person.last_name}`,
        value: person.id,
      }))
      setSearchOptions(newSearchOptions)
    }
  }, [loading])

  return (
    <Select
      value={{ label: SEARCH_BAR_PLACEHOLDER_TEXT }}
      onChange={addStakeholder}
      options={searchOptions}
      isDisabled={loading}
    />
  )
}

export default StakeholdersSelect
