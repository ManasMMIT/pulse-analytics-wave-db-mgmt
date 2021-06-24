import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@apollo/react-hooks'
import Select from 'react-select'
import _ from 'lodash'

import {
  GET_VEGA_PEOPLE_ROLES,
  GET_VEGA_STATES,
  GET_VEGA_PROVIDERS,
  GET_VEGA_PEOPLE_ROLES_INDICATIONS,
} from 'frontend/api/queries'
import { UPDATE_VEGA_PERSON } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'

import Spacing from 'frontend/utils/spacing'

import {
  InputSection,
  FormLabel,
  BlueText,
} from '../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const getHeaderTitle = (name) => (
  <p>
    Edit <BlueText>{name}</BlueText> Stakeholder
  </p>
)

const formatRoleSpecialtyOption = ({ id, indication, specialty_label }) => ({
  label: `${indication.name} - ${specialty_label}`,
  value: id,
  indication: indication.name,
})

const EditStakeholderForm = ({ stakeholder, closeModal }) => {
  const {
    id,
    name,
    stateId,
    stateName,
    roleId,
    roleName,
    providerName,
    providerId,
    roleSpecialties,
  } = stakeholder
  const defaultRoleSpecialties = roleSpecialties.map(formatRoleSpecialtyOption)
  const [personData, setPersonData] = useState({
    id,
    state: { id: stateId, name: stateName },
    role: { id: roleId, name: roleName },
    perception_tool_provider: { id: providerId, name: providerName },
    roleSpecialties: defaultRoleSpecialties,
  })

  const [providerOptions, setProviderOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [stateOptions, setStateOptions] = useState([])
  const [roleSpecialtyOptions, setRoleSpecialtyOptions] = useState([])

  const { data: statesData, loading: statesLoading } = useQuery(GET_VEGA_STATES)
  const { data: rolesData, loading: rolesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES
  )
  const { data: providersData, loading: providersLoading } = useQuery(
    GET_VEGA_PROVIDERS
  )
  const {
    data: roleSpecialtiesData,
    loading: roleSpecialtiesLoading,
  } = useQuery(GET_VEGA_PEOPLE_ROLES_INDICATIONS, {
    variables: { roleId: personData.role.id },
  })

  useEffect(() => {
    if (!providersLoading) {
      const options = providersData.vegaProviders.map(({ id, name }) => ({
        label: name,
        value: id,
      }))
      setProviderOptions(_.sortBy(options, 'label'))
    }
  }, [providersData, providersLoading])

  useEffect(() => {
    if (!rolesLoading) {
      const options = rolesData.vegaPeopleRoles.map(({ id, name }) => ({
        label: name,
        value: id,
      }))
      setRoleOptions(_.sortBy(options, 'label'))
    }
  }, [rolesData, rolesLoading])

  useEffect(() => {
    if (!statesLoading) {
      const options = statesData.vegaStates.map(({ id, abbreviation }) => ({
        label: abbreviation,
        value: id,
      }))
      setStateOptions(_.sortBy(options, 'label'))
    }
  }, [statesData, statesLoading])

  useEffect(() => {
    if (!roleSpecialtiesLoading) {
      const selectedSpecialtiesByIndication = _.keyBy(
        personData.roleSpecialties,
        'indication'
      )

      const options = roleSpecialtiesData.vegaPeopleRolesIndications.reduce(
        (acc, { id, specialty_label, indication }) => {
          if (selectedSpecialtiesByIndication[indication.name]) return acc
          const option = formatRoleSpecialtyOption({
            indication,
            specialty_label,
            id,
          })
          acc.push(option)
          return acc
        },
        []
      )

      setRoleSpecialtyOptions(_.sortBy(options, 'label'))
    }
  }, [roleSpecialtiesData, roleSpecialtiesLoading, personData.roleSpecialties])

  const [updatePerson, { loading: mutationLoading }] = useMutation(
    UPDATE_VEGA_PERSON,
    {
      onError: alert,
      onCompleted: () => {
        closeModal()
      },
    }
  )

  const handleChange = ({ label, value, key }) => {
    setPersonData((prevState) => ({
      ...prevState,
      [key]: { id: value, name: label },
    }))
  }

  const handleRoleChange = ({ label, value }) => {
    setPersonData((prevState) => ({
      ...prevState,
      role: { id: value, name: label },
      roleSpecialties: [],
    }))
  }

  const handleSpecialtyChange = (roleSpecialties) => {
    const roleSpecialtyValidation = roleSpecialties || []
    setPersonData((prevState) => ({
      ...prevState,
      roleSpecialties: roleSpecialtyValidation,
    }))
  }

  const updatePersonHandler = () => {
    const {
      state,
      role,
      perception_tool_provider,
      roleSpecialties,
    } = personData

    const role_specialties_ids = roleSpecialties.map(({ value }) => value)
    const input = {
      id,
      primary_state_id: state.id,
      role_id: role.id,
      perception_tool_provider_id: perception_tool_provider.id,
      role_specialties_ids,
    }

    updatePerson({ variables: { input } })
  }

  // * generate state option
  const selectedStateOption = personData.state.id
    ? {
        label: personData.state.name,
        value: personData.state.id,
      }
    : null

  // * generate selected role option
  const selectedRoleOption = personData.role.id
    ? {
        label: personData.role.name,
        value: personData.role.id,
      }
    : null

  // * generate selected provider option
  const selectedProviderOption = personData.perception_tool_provider.id
    ? {
        label: personData.perception_tool_provider.name,
        value: personData.perception_tool_provider.id,
      }
    : null

  // * generate selected role specialty label options
  const selectedRoleSpecialtyOptions = personData.roleSpecialties

  const dialogHeader = getHeaderTitle(name)

  return (
    <SingleActionDialog
      header={dialogHeader}
      submitText="Edit Stakeholder"
      submitHandler={updatePersonHandler}
      cancelHandler={closeModal}
    >
      <div style={{ padding: `${Spacing.S4} ${Spacing.S7} ${Spacing.S7}` }}>
        {mutationLoading ? (
          <Spinner />
        ) : (
          <div>
            <form>
              <InputSection>
                <FormLabel>State</FormLabel>
                <Select
                  value={selectedStateOption}
                  options={stateOptions}
                  onChange={(props) => handleChange({ ...props, key: 'state' })}
                  isDisabled={statesLoading}
                  placeholder="Select State.."
                />
              </InputSection>
              <InputSection>
                <FormLabel>Role</FormLabel>
                <Select
                  value={selectedRoleOption}
                  options={roleOptions}
                  onChange={handleRoleChange}
                  isDisabled={rolesLoading}
                  placeholder="Select Role.."
                />
              </InputSection>
              <InputSection>
                <FormLabel>Provider</FormLabel>
                <Select
                  value={selectedProviderOption}
                  options={providerOptions}
                  onChange={(props) =>
                    handleChange({ ...props, key: 'perception_tool_provider' })
                  }
                  isDisabled={providersLoading}
                  placeholder="Select Provider.."
                />
              </InputSection>
              <InputSection>
                <FormLabel>Role Specialties (Indication - Specialty)</FormLabel>
                <Select
                  isMulti
                  value={selectedRoleSpecialtyOptions}
                  options={roleSpecialtyOptions}
                  onChange={handleSpecialtyChange}
                  isDisabled={rolesLoading || roleSpecialtiesLoading}
                  placeholder="Select Role Specialties.."
                />
              </InputSection>
            </form>
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

EditStakeholderForm.propTypes = {
  stakeholder: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default EditStakeholderForm
