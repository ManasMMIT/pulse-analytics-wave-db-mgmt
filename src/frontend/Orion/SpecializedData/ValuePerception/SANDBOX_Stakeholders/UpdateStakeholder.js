import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import Select from 'react-select'
import { Button } from '@pulse-analytics/pulse-design-system'

import {
  GET_VEGA_PEOPLE_ROLES,
  GET_VEGA_PEOPLE_ROLES_INDICATIONS,
  GET_VEGA_STATES,
} from 'frontend/api/queries'
import { UPDATE_VEGA_PERSON } from 'frontend/api/mutations'

const NO_ROLE_OPTION = {
  label: 'No Role',
  value: null,
}

const UpdateStakeholder = ({ stakeholder }) => {
  const [stateOptions, setStateOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [roleSpecialtiesOptions, setRoleSpecialtiesOptions] = useState([])
  const [stagedPrimaryState, setStagedPrimaryState] = useState(
    stakeholder.primary_state
      ? {
          label: stakeholder.primary_state.abbreviation,
          value: stakeholder.primary_state.id,
        }
      : {
          label: 'Select State...',
          value: undefined,
        }
  )
  const [stagedRole, setStagedRole] = useState(
    stakeholder.role
      ? {
          label: stakeholder.role.name,
          value: stakeholder.role.id,
        }
      : NO_ROLE_OPTION
  )
  const [stagedRoleSpecialties, setStagedRoleSpecialties] = useState(undefined)

  const { data: statesData, loading: statesLoading } = useQuery(GET_VEGA_STATES)

  const { data: rolesData, loading: rolesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES
  )

  const {
    data: roleSpecialtiesData,
    loading: roleSpecialtiesLoading,
  } = useQuery(GET_VEGA_PEOPLE_ROLES_INDICATIONS, {
    variables: { roleId: stagedRole.value },
  })

  const {
    data: personRoleSpecialtiesData,
    loading: personRoleSpecialtiesLoading,
  } = useQuery(GET_VEGA_PEOPLE_ROLES_INDICATIONS, {
    variables: { personId: stakeholder.id },
  })

  const [updatePerson] = useMutation(UPDATE_VEGA_PERSON, {
    onError: alert,
  })

  useEffect(() => {
    if (!statesLoading) {
      const newStateOptions = statesData.vegaStates.map(
        ({ id, abbreviation }) => ({
          label: abbreviation,
          value: id,
        })
      )
      setStateOptions(newStateOptions)
    }
  }, [statesLoading])

  useEffect(() => {
    if (!rolesLoading) {
      const newRoleOptions = [
        NO_ROLE_OPTION,
        ...rolesData.vegaPeopleRoles.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      ]
      setRoleOptions(newRoleOptions)
    }
  }, [rolesLoading])

  /*
    useEffect for updating role specialties select options. Dependencies are
    loading of role specialties and selected role.
  */
  useEffect(() => {
    if (!roleSpecialtiesLoading) {
      const newRoleSpecialtiesOptions = roleSpecialtiesData.vegaPeopleRolesIndications.map(
        ({ id, specialty_label }) => ({
          label: specialty_label,
          value: id,
        })
      )
      setRoleSpecialtiesOptions(newRoleSpecialtiesOptions)
    }
  }, [roleSpecialtiesLoading, stagedRole])

  /*
    useEffect for initial loading of stakeholder's role specialties.
  */
  useEffect(() => {
    if (!personRoleSpecialtiesLoading) {
      const newStagedRoleSpecialties = personRoleSpecialtiesData.vegaPeopleRolesIndications.map(
        ({ id, specialty_label }) => ({
          label: specialty_label,
          value: id,
        })
      )
      setStagedRoleSpecialties(newStagedRoleSpecialties)
    }
  }, [personRoleSpecialtiesLoading])

  const handleStateSelection = (value) => {
    setStagedPrimaryState(value)
  }

  const handleRoleSelection = (value) => {
    setStagedRole(value)
    setStagedRoleSpecialties([])
  }

  const handleRoleSpecialtiesSelection = (value) => {
    value = value || []
    setStagedRoleSpecialties(value)
  }

  const savePerson = () => {
    const input = {
      id: stakeholder.id,
      primary_state_id: stagedPrimaryState.value,
      role_id: stagedRole.value,
      role_specialties_ids: stagedRoleSpecialties
        ? stagedRoleSpecialties.map(({ value }) => value)
        : stagedRoleSpecialties,
    }

    updatePerson({ variables: { input } })
  }

  return (
    <div>
      {`${stakeholder.first_name} ${stakeholder.last_name}`}
      <Select
        onChange={handleStateSelection}
        options={stateOptions}
        value={stagedPrimaryState}
        isDisabled={statesLoading}
      />
      <Select
        onChange={handleRoleSelection}
        options={roleOptions}
        value={stagedRole}
        isDisabled={rolesLoading}
      />
      <Select
        isMulti
        onChange={handleRoleSpecialtiesSelection}
        options={roleSpecialtiesOptions}
        value={stagedRoleSpecialties}
        isDisabled={
          !stagedRole.value ||
          roleSpecialtiesLoading ||
          personRoleSpecialtiesLoading
        }
        placeholder={'Select Role Specialties...'}
      />
      <Button onClick={savePerson}>Save</Button>
    </div>
  )
}

export default UpdateStakeholder
