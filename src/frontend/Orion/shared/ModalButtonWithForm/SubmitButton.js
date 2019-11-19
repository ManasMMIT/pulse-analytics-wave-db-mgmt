import React from 'react'
import styled from '@emotion/styled'
import { lighten } from 'polished'
import { useMutation } from '@apollo/react-hooks'
import Spinner from '../../../Phoenix/shared/Spinner'

import { Colors, Spacing, Transitions } from '../../../utils/pulseStyles'

const Button = styled.button({
  background: Colors.PRIMARY,
  border: 'none',
  borderRadius: 4,
  color: Colors.WHITE,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
  marginTop: Spacing.NORMAL,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  transition: Transitions.NORMAL,
  ':hover': {
    background: lighten(0.1, Colors.PRIMARY)
  }
})

const SubmitButton = ({
  state,
  mutationDoc,
  refetchQueries,
  afterMutationHook,
  afterSubmitHook,
}) => {
  const [handleSubmit, { loading, error }] = useMutation(
    mutationDoc,
    { refetchQueries, update: afterMutationHook },
  )

  if (loading) return <Spinner />
  if (error) {
    return (
      <div style={{ color: 'red' }}>
        {error.message || "Error processing request"}
      </div>
    )
  }

  return (
    <Button
      type="submit"
      onClick={() => (
        handleSubmit({ variables: state }).then(afterSubmitHook)
      )}
    >
      Submit + Close
    </Button>
  )
}

export default SubmitButton
