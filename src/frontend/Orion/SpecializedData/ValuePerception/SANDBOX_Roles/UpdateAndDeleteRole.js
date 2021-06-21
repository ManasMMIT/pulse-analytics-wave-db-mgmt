import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import Select from 'react-select'
import { Button } from '@pulse-analytics/pulse-design-system'

import {
  GET_VEGA_PEOPLE_ROLES,
  GET_VEGA_PEOPLE_ROLES_TYPES,
} from 'frontend/api/queries'
import {
  UPDATE_VEGA_PERSON_ROLE,
  DELETE_VEGA_PERSON_ROLE,
} from 'frontend/api/mutations'

import Color from 'frontend/utils/color'

const UpdateAndDeleteRole = ({ role }) => {
  const [stagedName, setStagedName] = useState(role.name)
  const [
    stagedDefaultSpecialtyLabel,
    setStagedDefaultSpecialtyLabel,
  ] = useState(role.default_specialty_label || undefined)
  const [stagedType, setStagedType] = useState(
    role.type
      ? {
          label: role.type.name,
          value: role.type.id,
        }
      : {
          label: 'Select Type...',
          value: undefined,
        }
  )
  const [roleTypeOptions, setRoleTypeOptions] = useState([])

  const { data: rolesTypesData, loading: rolesTypesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES_TYPES
  )

  const [updateRole] = useMutation(UPDATE_VEGA_PERSON_ROLE, {
    variables: {
      input: {
        id: role.id,
        name: stagedName,
        default_specialty_label: stagedDefaultSpecialtyLabel,
        type_id: stagedType.value,
      },
    },
    onError: alert,
  })

  const [deleteRole] = useMutation(DELETE_VEGA_PERSON_ROLE, {
    variables: {
      input: {
        id: role.id,
      },
    },
    update: (cache) => {
      const { vegaPeopleRoles: currRoles } = cache.readQuery({
        query: GET_VEGA_PEOPLE_ROLES,
      })

      const newRoles = currRoles.filter(({ id }) => id !== role.id)

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
      <Button onClick={updateRole}>Update Role</Button>
      <Button onClick={deleteRole}>Delete Role</Button>
    </div>
  )
}

export default UpdateAndDeleteRole
