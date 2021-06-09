import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button } from '@pulse-analytics/pulse-design-system'

import {
  UPDATE_VEGA_PERSON_ROLE_INDICATION,
  DELETE_VEGA_PERSON_ROLE_INDICATION,
} from 'frontend/api/mutations'
import { GET_VEGA_PEOPLE_ROLES_INDICATIONS } from 'frontend/api/queries'

import Color from 'frontend/utils/color'

const UpdateAndDeleteRoleSpecialty = ({ roleSpecialty }) => {
  const [stagedInput, setStagedInput] = useState({
    specialty_label: roleSpecialty.specialty_label,
  })

  const [updateRoleSpecialty] = useMutation(
    UPDATE_VEGA_PERSON_ROLE_INDICATION,
    {
      variables: {
        input: {
          id: roleSpecialty.id,
          specialty_label: stagedInput.specialty_label,
        },
      },
      onError: alert,
    }
  )

  const [deleteRoleSpecialty] = useMutation(
    DELETE_VEGA_PERSON_ROLE_INDICATION,
    {
      variables: {
        input: {
          id: roleSpecialty.id,
        },
      },
      update: (cache) => {
        const { vegaPeopleRolesIndications } = cache.readQuery({
          query: GET_VEGA_PEOPLE_ROLES_INDICATIONS,
        })

        const newRoleSpecialties = vegaPeopleRolesIndications.filter(
          ({ id }) => id !== roleSpecialty.id
        )

        cache.writeQuery({
          query: GET_VEGA_PEOPLE_ROLES_INDICATIONS,
          data: { vegaPeopleRolesIndications: newRoleSpecialties },
        })
      },
      onError: alert,
    }
  )

  const handleSpecialtyLabelChange = (e) => {
    setStagedInput({ ...stagedInput, specialty_label: e.target.value })
  }

  return (
    <div>
      <input
        style={{
          background: Color.LIGHT_BLUE_GRAY_2,
          padding: 12,
          margin: 5,
        }}
        placeholder="Enter specialty label..."
        onChange={handleSpecialtyLabelChange}
        value={stagedInput.specialty_label}
      />
      {`${roleSpecialty.person_role} ${roleSpecialty.indication.name}`}
      <Button onClick={updateRoleSpecialty}>Update Role Specialty</Button>
      <Button onClick={deleteRoleSpecialty}>Delete Role Specialty</Button>
    </div>
  )
}

export default UpdateAndDeleteRoleSpecialty
