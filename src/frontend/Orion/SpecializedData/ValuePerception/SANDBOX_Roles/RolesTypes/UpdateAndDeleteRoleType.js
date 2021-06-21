import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_VEGA_PEOPLE_ROLES_TYPES } from 'frontend/api/queries'
import {
  UPDATE_VEGA_PERSON_ROLE_TYPE,
  DELETE_VEGA_PERSON_ROLE_TYPE,
} from 'frontend/api/mutations'

import Color from 'frontend/utils/color'

const UpdateAndDeleteRoleType = ({ roleType }) => {
  const [stagedName, setStagedName] = useState(roleType.name)

  const [updateRoleType] = useMutation(UPDATE_VEGA_PERSON_ROLE_TYPE, {
    variables: {
      input: {
        id: roleType.id,
        name: stagedName,
      },
    },
    onError: alert,
  })

  const [deleteRoleType] = useMutation(DELETE_VEGA_PERSON_ROLE_TYPE, {
    variables: {
      input: {
        id: roleType.id,
      },
    },
    update: (cache) => {
      const { vegaPeopleRolesTypes: currRolesTypes } = cache.readQuery({
        query: GET_VEGA_PEOPLE_ROLES_TYPES,
      })

      const newRolesTypes = currRolesTypes.filter(
        ({ id }) => id !== roleType.id
      )

      cache.writeQuery({
        query: GET_VEGA_PEOPLE_ROLES_TYPES,
        data: { vegaPeopleRolesTypes: newRolesTypes },
      })
    },
    onError: alert,
  })

  const handleNameChange = (e) => {
    setStagedName(e.target.value)
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
      <Button onClick={updateRoleType}>Update Role Type</Button>
      <Button onClick={deleteRoleType}>Delete Role Type</Button>
    </div>
  )
}

export default UpdateAndDeleteRoleType
