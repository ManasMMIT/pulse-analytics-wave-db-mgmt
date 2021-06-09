import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Select from 'react-select'
import { Button } from '@pulse-analytics/pulse-design-system'

import {
  GET_VEGA_PEOPLE_ROLES_INDICATIONS,
  GET_VEGA_PEOPLE_ROLES,
  GET_VEGA_INDICATIONS,
} from 'frontend/api/queries'
import { CREATE_VEGA_PERSON_ROLE_INDICATION } from 'frontend/api/mutations'

import Color from 'frontend/utils/color'

import UpdateAndDeleteRoleSpecialty from './UpdateAndDeleteRoleSpecialty'

const RoleSpecialties = () => {
  const [roleOptions, setRoleOptions] = useState([])
  const [indicationOptions, setIndicationOptions] = useState([])
  const [stagedInput, setStagedInput] = useState({
    specialty_label: '',
    role: {
      label: 'Select Role...',
      value: undefined,
    },
    indication: {
      label: 'Select Indication...',
      value: undefined,
    },
  })

  const {
    data: roleSpecialtiesData,
    loading: roleSpecialtiesLoading,
  } = useQuery(GET_VEGA_PEOPLE_ROLES_INDICATIONS)

  const { data: rolesData, loading: rolesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES
  )

  const { data: indicationsData, loading: indicationsLoading } = useQuery(
    GET_VEGA_INDICATIONS
  )

  const [createRoleSpecialty] = useMutation(
    CREATE_VEGA_PERSON_ROLE_INDICATION,
    {
      variables: {
        input: {
          specialty_label: stagedInput.specialty_label,
          person_role_id: stagedInput.role.value,
          indication_id: stagedInput.indication.value,
        },
      },
      update: (cache, { data: { createVegaPersonRoleIndication } }) => {
        const newRoleSpecialties = [
          ...roleSpecialtiesData.vegaPeopleRolesIndications,
          createVegaPersonRoleIndication,
        ]

        cache.writeQuery({
          query: GET_VEGA_PEOPLE_ROLES_INDICATIONS,
          data: { vegaPeopleRolesIndications: newRoleSpecialties },
        })
      },
      onError: alert,
    }
  )

  useEffect(() => {
    if (!rolesLoading) {
      const newRoleOptions = rolesData.vegaPeopleRoles.map(({ id, name }) => ({
        label: name,
        value: id,
      }))

      setRoleOptions(newRoleOptions)
    }
  }, [rolesLoading])

  useEffect(() => {
    if (!indicationsLoading) {
      const newIndicationOptions = indicationsData.vegaIndications.map(
        ({ id, name }) => ({
          label: name,
          value: id,
        })
      )

      setIndicationOptions(newIndicationOptions)
    }
  }, [indicationsLoading])

  if (roleSpecialtiesLoading) return <div>Loading...</div>

  const handleSpecialtyLabelChange = (e) => {
    setStagedInput({ ...stagedInput, specialty_label: e.target.value })
  }

  const handleRoleChange = (value) => {
    setStagedInput({ ...stagedInput, role: value })
  }

  const handleIndicationChange = (value) => {
    setStagedInput({ ...stagedInput, indication: value })
  }

  return (
    <div>
      <h1>Role Specialties</h1>
      <h2>Create Role Specialty</h2>
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
        <Select
          onChange={handleRoleChange}
          options={roleOptions}
          value={stagedInput.role}
          isDisabled={rolesLoading}
        />
        <Select
          onChange={handleIndicationChange}
          options={indicationOptions}
          value={stagedInput.indication}
          isDisabled={indicationsLoading}
        />
        <Button onClick={createRoleSpecialty}>Create Role Specialty</Button>
      </div>
      <h2>All Role Specialties</h2>
      {roleSpecialtiesData.vegaPeopleRolesIndications.map((roleSpecialty) => (
        <UpdateAndDeleteRoleSpecialty
          key={roleSpecialty.id}
          roleSpecialty={roleSpecialty}
        />
      ))}
    </div>
  )
}

export default RoleSpecialties
