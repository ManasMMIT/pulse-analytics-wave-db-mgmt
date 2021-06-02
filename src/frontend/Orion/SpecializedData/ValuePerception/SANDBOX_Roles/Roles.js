import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import Select from 'react-select'
import { Button } from '@pulse-analytics/pulse-design-system'

import {
  GET_VEGA_PEOPLE_ROLES,
  GET_VEGA_PEOPLE_ROLES_TYPES,
} from 'frontend/api/queries'
import { CREATE_VEGA_PERSON_ROLE } from 'frontend/api/mutations'

import Color from 'frontend/utils/color'

import RolesTypes from './RolesTypes'
import UpdateAndDeleteRole from './UpdateAndDeleteRole'

const Roles = () => {
  const [stagedName, setStagedName] = useState('')
  const [
    stagedDefaultSpecialtyLabel,
    setStagedDefaultSpecialtyLabel,
  ] = useState('')
  const [stagedType, setStagedType] = useState({
    label: 'Select Type...',
    value: null,
  })
  const [roleTypeOptions, setRoleTypeOptions] = useState([])

  const { data: rolesData, loading: rolesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES
  )

  const { data: rolesTypesData, loading: rolesTypesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES_TYPES
  )

  const [createRole] = useMutation(CREATE_VEGA_PERSON_ROLE, {
    variables: {
      input: {
        name: stagedName,
        default_specialty_label: stagedDefaultSpecialtyLabel,
        type_id: stagedType.value,
      },
    },
    update: (cache, { data: { createVegaPersonRole } }) => {
      const newRoles = [...rolesData.vegaPeopleRoles, createVegaPersonRole]

      cache.writeQuery({
        query: GET_VEGA_PEOPLE_ROLES,
        data: { vegaPeopleRoles: newRoles },
      })
    },
    onError: alert,
  })

  useEffect(() => {
    if (!rolesTypesLoading) {
      const newRoleTypeOptions = rolesTypesData.vegaPeopleRolesTypes.map(
        (personRoleType) => ({
          label: personRoleType.name,
          value: personRoleType.id,
        })
      )

      setRoleTypeOptions(newRoleTypeOptions)
    }
  }, [rolesTypesLoading])

  if (rolesLoading) return <div>Loading...</div>

  const handleNameChange = (e) => {
    setStagedName(e.target.value)
  }

  const handleDefaultSpecialtyLabelChange = (e) => {
    setStagedDefaultSpecialtyLabel(e.target.value)
  }

  const handleTypeChange = (value) => {
    setStagedType(value)
  }

  return (
    <div>
      <h1>Roles</h1>
      <h2>Roles Types</h2>
      <RolesTypes />
      <h2>Create Role</h2>
      <div>
        <input
          style={{
            background: Color.LIGHT_BLUE_GRAY_2,
            padding: 12,
            margin: 5,
          }}
          placeholder="Enter name..."
          onChange={handleNameChange}
          value={stagedName}
        />
        <input
          style={{
            background: Color.LIGHT_BLUE_GRAY_2,
            padding: 12,
            margin: 5,
          }}
          placeholder="Enter default_specialty_label..."
          onChange={handleDefaultSpecialtyLabelChange}
          value={stagedDefaultSpecialtyLabel}
        />
        <Select
          onChange={handleTypeChange}
          options={roleTypeOptions}
          value={stagedType}
          isDisabled={rolesTypesLoading}
        />
        <Button onClick={createRole}>Create Role</Button>
      </div>
      <h2>All Roles</h2>
      {rolesData.vegaPeopleRoles.map((role) => (
        <UpdateAndDeleteRole key={role.id} role={role} />
      ))}
    </div>
  )
}

export default Roles
