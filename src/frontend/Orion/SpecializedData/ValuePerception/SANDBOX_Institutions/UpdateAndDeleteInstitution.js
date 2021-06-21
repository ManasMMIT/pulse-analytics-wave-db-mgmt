import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_INSTITUTIONS } from 'frontend/api/queries'
import { UPDATE_INSTITUTION, DELETE_INSTITUTION } from 'frontend/api/mutations'

import Color from 'frontend/utils/color'

const UpdateAndDeleteInstitution = ({ institution }) => {
  const [stagedInput, setStagedInput] = useState({
    name: institution.name,
  })

  const [updateInstitution] = useMutation(UPDATE_INSTITUTION, {
    variables: {
      input: {
        id: institution.id,
        name: stagedInput.name,
      },
    },
    onError: alert,
  })

  const [deleteInstitution] = useMutation(DELETE_INSTITUTION, {
    variables: {
      input: {
        id: institution.id,
      },
    },
    update: (cache) => {
      const { vegaInstitutions } = cache.readQuery({
        query: GET_INSTITUTIONS,
      })
      const newInstitutions = vegaInstitutions.filter(
        ({ id }) => id !== institution.id
      )
      cache.writeQuery({
        query: GET_INSTITUTIONS,
        data: { vegaInstitutions: newInstitutions },
      })
    },
    onError: alert,
  })

  const handleNameChange = (e) => {
    setStagedInput({ ...stagedInput, name: e.target.value })
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
        value={stagedInput.name}
      />
      <Button onClick={updateInstitution}>Update Institution</Button>
      <Button onClick={deleteInstitution}>Delete Institution</Button>
    </div>
  )
}

export default UpdateAndDeleteInstitution
