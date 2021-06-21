import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_INSTITUTIONS } from 'frontend/api/queries'
import { CREATE_INSTITUTION } from 'frontend/api/mutations'

import Color from 'frontend/utils/color'

import UpdateAndDeleteInstitution from './UpdateAndDeleteInstitution'

const Institutions = () => {
  const [stagedInput, setStagedInput] = useState({
    name: '',
  })

  const { data: institutionsData, loading: institutionsLoading } = useQuery(
    GET_INSTITUTIONS
  )

  const [createInstitution] = useMutation(CREATE_INSTITUTION, {
    variables: {
      input: {
        name: stagedInput.name,
      },
    },
    update: (cache, { data: { createVegaInstitution } }) => {
      const newInstitutions = [
        ...institutionsData.vegaInstitutions,
        createVegaInstitution,
      ]
      cache.writeQuery({
        query: GET_INSTITUTIONS,
        data: { vegaInstitutions: newInstitutions },
      })
    },
    onError: alert,
  })

  if (institutionsLoading) return <div>Loading...</div>

  const handleNameChange = (e) => {
    setStagedInput({ ...stagedInput, name: e.target.value })
  }

  return (
    <div>
      <h1>Institutions</h1>
      <h2>Create Institution</h2>
      <div>
        <input
          style={{
            background: Color.LIGHT_BLUE_GRAY_2,
            padding: 12,
            margin: 5,
          }}
          placeholder="Enter name..."
          onChange={handleNameChange}
          value={stagedInput.name}
        />
        <Button onClick={createInstitution}>Create Institution</Button>
      </div>
      <h2>All Institutions</h2>
      {institutionsData.vegaInstitutions.map((institution) => (
        <UpdateAndDeleteInstitution
          key={institution.id}
          institution={institution}
        />
      ))}
    </div>
  )
}

export default Institutions
