import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import {
  BULK_CREATE_TREATMENT_PLAN,
} from './../../../../api/mutations'

import Spinner from 'frontend/components/Spinner'

const SUBTITLE = `The following Treatment Plans don't exist. Create them so they can be used in the application.`

const Button = styled.button({
  border: 'none',
  background: '#006aff',
  color: 'white',
  fontWeight: 700,
  padding: 6,
  borderRadius: 3,
  marginTop: 12,
}, style => ({ ...style }))

const CreateTreatmentPlansButton = ({ newTreatmentPlans }) => {
  const [handleCreate, { error, loading }] = useMutation(BULK_CREATE_TREATMENT_PLAN)

  if (error) {
    return <div style={{ color: 'red' }}>Error processing request</div>
  }

  if (loading) return <Spinner fill="white" />

  const handleSubmit = (e) => {
    handleCreate({
      variables: {
        input: { data: newTreatmentPlans }
      }
    })
  }

  return (
    <>
      <div>{SUBTITLE}</div>
      <Button onClick={handleSubmit}>Create Plans</Button>
    </>
  )
}

export default CreateTreatmentPlansButton
