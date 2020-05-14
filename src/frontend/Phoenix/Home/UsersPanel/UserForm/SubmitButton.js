import React from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled";
import {
  useMutation,
  useApolloClient,
} from '@apollo/react-hooks'
import { lighten } from 'polished'

import Spinner from 'frontend/components/Spinner'
import { Colors } from '../../../../utils/pulseStyles'

const Button = styled.button({
  background: Colors.PRIMARY,
  border: 'none',
  borderRadius: 4,
  color: Colors.WHITE,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
  padding: '12px 24px',
  width: 'auto',
  ':hover': {
    background: lighten(0.1, Colors.PRIMARY),
  }
})

const SubmitButton = ({
  mutationDoc,
  afterSubmitHook,
  clientMutation,
  input,
}) => {
  const client = useApolloClient()

  const updateMutationCallback = (
    store,
    { data }
  ) => client.mutate({
    mutation: clientMutation,
    variables: { data },
  })

  const [
    handleSubmit,
    { loading, error }
  ] = useMutation(mutationDoc, { update: updateMutationCallback })

  if (loading) return <Spinner />
  
  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error.message}
      </div>
    )
  }

  return (
    <Button
      type="submit"
      onClick={() => handleSubmit({
        variables: { input },
      }).then(afterSubmitHook)}
    >
      Submit
    </Button>
  )
}

SubmitButton.propTypes = {
  mutationDoc: PropTypes.object,
  afterSubmitHook: PropTypes.func,
  clientMutation: PropTypes.object,
  input: PropTypes.object,
}

export default SubmitButton
