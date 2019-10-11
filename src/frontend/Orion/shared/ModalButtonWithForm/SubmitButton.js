import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import Spinner from '../../../Phoenix/shared/Spinner'

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
    <button
      type="submit"
      onClick={() => (
        handleSubmit({ variables: state }).then(afterSubmitHook)
      )}
    >
      submit
    </button>
  )
}

export default SubmitButton
