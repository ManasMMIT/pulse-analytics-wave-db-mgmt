import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_VEGA_PEOPLE_ROLES_TYPES } from 'frontend/api/queries'
import { CREATE_VEGA_PERSON_ROLE_TYPE } from 'frontend/api/mutations'

import Color from 'frontend/utils/color'

import UpdateAndDeleteRoleType from './UpdateAndDeleteRoleType'

const RolesTypes = () => {
  const [stagedName, setStagedName] = useState('')

  const { data: rolesTypesData, loading: rolesTypesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES_TYPES
  )

  const [createRoleType] = useMutation(CREATE_VEGA_PERSON_ROLE_TYPE, {
    variables: { input: { name: stagedName } },
    update: (cache, { data: { createVegaPersonRoleType } }) => {
      const newRolesTypes = [
        ...rolesTypesData.vegaPeopleRolesTypes,
        createVegaPersonRoleType,
      ]

      cache.writeQuery({
        query: GET_VEGA_PEOPLE_ROLES_TYPES,
        data: { vegaPeopleRolesTypes: newRolesTypes },
      })
    },
    onError: alert,
  })

  if (rolesTypesLoading) return <div>Loading...</div>

  const handleNameChange = (e) => {
    setStagedName(e.target.value)
  }

  return (
    <div>
      <h3>Create Role Type</h3>
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
      <Button onClick={createRoleType}>Create Role Type</Button>
      <h3>All Roles Types</h3>
      {rolesTypesData.vegaPeopleRolesTypes.map((roleType) => (
        <UpdateAndDeleteRoleType key={roleType.id} roleType={roleType} />
      ))}
    </div>
  )
}

export default RolesTypes
