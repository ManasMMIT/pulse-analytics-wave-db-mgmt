import React from 'react'
import PropTypes from 'prop-types'
import {
  useMutation,
  useApolloClient,
} from '@apollo/react-hooks'

import Spinner from '../../../shared/Spinner'

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
  if (error) return <div style={{ color: 'red' }}>Error processing request</div>

  return (
    <button
      style={{ marginTop: 20 }}
      type="submit"
      onClick={() => handleSubmit({
        variables: { input },
      }).then(afterSubmitHook)}
    >
      Submit
    </button>
  )
}

SubmitButton.propTypes = {
  mutationDoc: PropTypes.object,
  afterSubmitHook: PropTypes.func,
  clientMutation: PropTypes.object,
  input: PropTypes.object,
}

export default SubmitButton
