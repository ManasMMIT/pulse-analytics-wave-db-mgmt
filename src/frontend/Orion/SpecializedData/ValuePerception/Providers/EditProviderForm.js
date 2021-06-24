import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Select from 'react-select'

import {
  GET_INSTITUTIONS,
  GET_COMMUNITY_PRACTICE_NETWORKS,
} from 'frontend/api/queries'
import { UPDATE_VEGA_PROVIDER } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'

import Spacing from 'frontend/utils/spacing'

import {
  InputSection,
  FormLabel,
  BlueText,
} from '../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

import {
  PROVIDER_TYPE_MAP,
  PROVIDER_TYPE_OPTIONS,
  NO_CPN_OPTION,
} from './utils'

const formatOption = ({ id, name }) => ({ value: id, label: name })

const EditProviderForm = ({ selectedProviderData, closeHandler }) => {
  const {
    id,
    name,
    type,
    institutions,
    community_practice_network,
  } = selectedProviderData
  const defaultInstitutions = institutions.map(formatOption)
  const defaultCpn = community_practice_network
    ? formatOption(community_practice_network)
    : {}

  const [formData, setFormData] = useState({
    type: { value: type, label: PROVIDER_TYPE_MAP[type] },
    institutions: defaultInstitutions,
    community_practice_network: defaultCpn,
  })

  const [institutionsOptions, setInstitutionOptions] = useState([])
  const [cpnOptions, setCpnOptions] = useState([])

  const { data: institutionsData, loading: institutionsLoading } = useQuery(
    GET_INSTITUTIONS
  )

  const { data: cpnsData, loading: cpnsLoading } = useQuery(
    GET_COMMUNITY_PRACTICE_NETWORKS
  )

  useEffect(() => {
    if (!cpnsLoading) {
      const options = cpnsData.vegaCommunityPracticeNetworks.map(formatOption)
      setCpnOptions([NO_CPN_OPTION, ...options])
    }
  }, [cpnsData, cpnsLoading])

  useEffect(() => {
    if (!institutionsLoading) {
      const options = institutionsData.vegaInstitutions.map(formatOption)
      setInstitutionOptions(options)
    }
  }, [institutionsData, institutionsLoading])

  const [updateProvider, { loading: mutationLoading }] = useMutation(
    UPDATE_VEGA_PROVIDER,
    {
      variables: {
        input: {
          id,
          type: formData.type.value,
          institutions_ids: formData.institutions.map(({ value }) => value),
          community_practice_network_id:
            formData.community_practice_network.value,
        },
      },
      onError: alert,
      onCompleted: () => {
        closeHandler()
      },
    }
  )

  const handleTypeChange = (props) => {
    setFormData((prevState) => ({ ...prevState, type: props }))
  }

  const handleCpnChange = (props) => {
    setFormData((prevState) => ({
      ...prevState,
      community_practice_network: props,
    }))
  }

  const handleInstitutionChange = (props) => {
    const institutionValidation = props || []
    setFormData((prevState) => ({
      ...prevState,
      institutions: institutionValidation,
    }))
  }

  const header = (
    <p>
      Edit <BlueText>{name}</BlueText> Provider
    </p>
  )

  return (
    <SingleActionDialog
      header={header}
      submitText="Edit Provider"
      submitHandler={updateProvider}
      cancelHandler={closeHandler}
    >
      <div style={{ padding: Spacing.S7 }}>
        {mutationLoading ? (
          <div style={{ height: 236, textAlign: 'center' }}>
            <Spinner size={32} />
          </div>
        ) : (
          <div>
            <form>
              <InputSection>
                <FormLabel>Type</FormLabel>
                <Select
                  value={formData.type}
                  options={PROVIDER_TYPE_OPTIONS}
                  onChange={handleTypeChange}
                />
              </InputSection>
              <InputSection>
                <FormLabel>Institutions</FormLabel>
                <Select
                  isMulti
                  value={formData.institutions}
                  options={institutionsOptions}
                  onChange={handleInstitutionChange}
                  isDisabled={institutionsLoading}
                />
              </InputSection>
              <InputSection>
                <FormLabel>Community Practice Network</FormLabel>
                <Select
                  value={formData.community_practice_network}
                  options={cpnOptions}
                  onChange={handleCpnChange}
                  isDisabled={cpnsLoading}
                />
              </InputSection>
            </form>
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

EditProviderForm.propTypes = {
  selectedProviderData: PropTypes.object.isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default EditProviderForm
