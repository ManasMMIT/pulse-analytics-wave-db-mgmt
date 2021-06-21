import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Select from 'react-select'
import { Button } from '@pulse-analytics/pulse-design-system'

import {
  GET_INSTITUTIONS,
  GET_COMMUNITY_PRACTICE_NETWORKS,
} from 'frontend/api/queries'
import { UPDATE_VEGA_PROVIDER } from 'frontend/api/mutations'

const PROVIDER_TYPE_LABELS = {
  '': 'No Type',
  institution: 'Institution',
  community_practice: 'Community Practice',
}

const PROVIDER_TYPE_OPTIONS = Object.entries(
  PROVIDER_TYPE_LABELS
).map(([value, label]) => ({ label, value }))

const NO_CPN_OPTION = {
  label: 'No Community Practice Network',
  value: null,
}

const UpdateProvider = ({ provider }) => {
  const [institutionsOptions, setInstitutionsOptions] = useState([])
  const [cpnOptions, setCpnOptions] = useState([])

  const [stagedInput, setStagedInput] = useState({
    type: { label: PROVIDER_TYPE_LABELS[provider.type], value: provider.type },
    institutions: provider.institutions
      ? provider.institutions.map(({ id, name }) => ({
          label: name,
          value: id,
        }))
      : [],
    community_practice_network: provider.community_practice_network
      ? {
          label: provider.community_practice_network.name,
          value: provider.community_practice_network.id,
        }
      : NO_CPN_OPTION,
  })

  const { data: institutionsData, loading: institutionsLoading } = useQuery(
    GET_INSTITUTIONS
  )

  const { data: cpnsData, loading: cpnsLoading } = useQuery(
    GET_COMMUNITY_PRACTICE_NETWORKS
  )

  const [updateProvider] = useMutation(UPDATE_VEGA_PROVIDER, {
    variables: {
      input: {
        id: provider.id,
        type: stagedInput.type.value,
        institutions_ids: stagedInput.institutions.map(({ value }) => value),
        community_practice_network_id:
          stagedInput.community_practice_network.value,
      },
    },
    onError: alert,
  })

  /*
    useEffect for updating institutions options on load.
  */
  useEffect(() => {
    if (!institutionsLoading) {
      const newInstitutionsOptions = institutionsData.vegaInstitutions.map(
        ({ id, name }) => ({ label: name, value: id })
      )
      setInstitutionsOptions(newInstitutionsOptions)
    }
  }, [institutionsLoading])

  /*
    useEffect for updating community practice network options on load.
  */
  useEffect(() => {
    if (!cpnsLoading) {
      const newCpnOptions = [
        NO_CPN_OPTION,
        ...cpnsData.vegaCommunityPracticeNetworks.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      ]
      setCpnOptions(newCpnOptions)
    }
  }, [cpnsLoading])

  const handleTypeSelection = (value) => {
    setStagedInput({ ...stagedInput, type: value })
  }

  const handleInstitutionsSelection = (value) => {
    value = value || []
    setStagedInput({ ...stagedInput, institutions: value })
  }

  const handleCpnSelection = (value) => {
    setStagedInput({ ...stagedInput, community_practice_network: value })
  }

  return (
    <div>
      {provider.name}
      <Select
        onChange={handleTypeSelection}
        options={PROVIDER_TYPE_OPTIONS}
        value={stagedInput.type}
      />
      <Select
        isMulti
        onChange={handleInstitutionsSelection}
        options={institutionsOptions}
        value={stagedInput.institutions}
        isDisabled={institutionsLoading}
        placeholder={'Select Institutions...'}
      />
      <Select
        onChange={handleCpnSelection}
        options={cpnOptions}
        value={stagedInput.community_practice_network}
        isDisabled={cpnsLoading}
      />
      <Button onClick={updateProvider}>Update Provider</Button>
    </div>
  )
}

export default UpdateProvider
