import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import Select from 'react-select'
import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_VEGA_PEOPLE_ROLES, GET_VEGA_STATES } from 'frontend/api/queries'
import { UPDATE_VEGA_PERSON } from 'frontend/api/mutations'

const UpdateStakeholder = ({ stakeholder }) => {
  const [stateOptions, setStateOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
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
      : {
          label: 'Select Role...',
          value: undefined,
        }
  )

  const { data: statesData, loading: statesLoading } = useQuery(GET_VEGA_STATES)

  const { data: rolesData, loading: rolesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES
  )

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
      const newRoleOptions = rolesData.vegaPeopleRoles.map(({ id, name }) => ({
        label: name,
        value: id,
      }))
      setRoleOptions(newRoleOptions)
    }
  }, [rolesLoading])

  const handleStateSelection = (value) => {
    setStagedPrimaryState(value)
  }

  const handleRoleSelection = (value) => {
    setStagedRole(value)
  }

  const savePerson = () => {
    const input = {
      id: stakeholder.id,
      primary_state_id: stagedPrimaryState.value,
      role_id: stagedRole.value,
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
      <Button onClick={savePerson}>Save</Button>
    </div>
  )
}

export default UpdateStakeholder
