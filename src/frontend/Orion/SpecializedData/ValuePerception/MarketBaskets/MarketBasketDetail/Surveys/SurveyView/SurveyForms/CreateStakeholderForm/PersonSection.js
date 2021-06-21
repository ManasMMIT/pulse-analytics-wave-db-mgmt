import React from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Select from 'react-select'

import { GET_VEGA_PEOPLE } from 'frontend/api/queries'
import { UPDATE_MARKET_BASKET_SURVEY } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'

import StakeholderTable from './StakeholderTable'
import { InputSection, FormLabel } from '../utils'

const PersonSection = ({ surveyId, surveyData }) => {
  const { data: vegaPeople, loading: vegaPeopleLoading } = useQuery(
    GET_VEGA_PEOPLE
  )
  const [updateStakeholders, { loading: mutationLoading }] = useMutation(
    UPDATE_MARKET_BASKET_SURVEY,
    {
      onError: alert,
    }
  )

  const isLoading = vegaPeopleLoading || mutationLoading
  const stakeholderIds = surveyData.stakeholders || []
  const stakeholders = surveyData.stakeholders_full || []

  const addStakeholder = ({ value }) => {
    const newStakeholders = [...stakeholderIds, value]
    updateStakeholders({
      variables: {
        input: {
          id: surveyId,
          stakeholders: newStakeholders,
        },
      },
    })
  }

  const removeStakeholder = (selectedStakeholders) => {
    const idsToFilter = selectedStakeholders.map(({ original: { id } }) => id)
    const newStakeholders = stakeholderIds.filter(
      (id) => !idsToFilter.includes(id)
    )

    updateStakeholders({
      variables: {
        input: {
          id: surveyId,
          stakeholders: newStakeholders,
        },
      },
    })
  }

  let peopleOptions = []
  if (!vegaPeopleLoading) {
    vegaPeople.vegaPeople.forEach(({ id, first_name, last_name, role }) => {
      if (!stakeholderIds.includes(id)) {
        const roleValue = role ? role.name : ''
        peopleOptions.push({
          value: id,
          label: `${first_name} ${last_name} ${roleValue}`,
        })
      }
    })
  }

  return (
    <section>
      <h3>Person Selection</h3>
      <p>
        What person do you want to associate with this Market Basket Survey?
      </p>
      {isLoading ? (
        <Spinner />
      ) : (
        <section>
          <InputSection>
            <FormLabel>People</FormLabel>
            <Select onChange={addStakeholder} options={peopleOptions} />
          </InputSection>
          <StakeholderTable
            key="subset"
            data={stakeholders}
            onStakeholderDelete={removeStakeholder}
          />
        </section>
      )}
    </section>
  )
}

PersonSection.propTypes = {
  surveyId: PropTypes.string.isRequired,
  surveyData: PropTypes.object.isRequired,
}

export default PersonSection
