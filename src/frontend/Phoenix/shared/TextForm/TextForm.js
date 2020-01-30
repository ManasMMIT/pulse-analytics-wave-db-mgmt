import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useApolloClient } from '@apollo/react-hooks'

import Spinner from '../Spinner'

class TextForm extends Component {
  constructor(props) {
    super(props)
    const {
      data: {
        description
      },
      additionalFormData
    } = props

    this.state = { description, ...additionalFormData }
  }

  handleChange = e => {
    const {
      value,
      name,
    } = e.target

    this.setState({ [name]: value })
  }

  render() {
    const {
      state,
      handleChange,
      props: {
        handleSubmit,
        afterSubmitHook,
      },
    } = this

    return (
      <div>
        <input
          type="text"
          name={"description"}
          onChange={handleChange}
          value={state.description}
        />
        <button
          type="submit"
          onClick={() => handleSubmit({ variables: { input: state } }).then(afterSubmitHook)}
        >
          submit
        </button>
      </div>
    );
  }
}

const TextFormContainer = ({ 
  mutationDoc, 
  clientMutation,
  refetchQueries,
  ...otherProps 
}) => {
  const client = useApolloClient()

  const updateClientMutationCallback = clientMutation
    ? (cache, { data }) => {
      client.mutate({
        mutation: clientMutation,
        variables: { data },
      })
    }
    : () => {}

  const [handleSubmit, { loading, error }] = useMutation(
    mutationDoc,
    { 
      update: updateClientMutationCallback,
      refetchQueries,
    },
  )

  if (loading) return <Spinner />
  if (error) return <div style={{ color: 'red' }}>Error processing request</div>

  return (
    <TextForm
      handleSubmit={handleSubmit}
      {...otherProps}
    />
  )
}

TextFormContainer.propTypes = {
  data: PropTypes.object,
  mutationDoc: PropTypes.object,
  afterMutationHook: PropTypes.func,
  clientMutation: PropTypes.object,
  additionalFormData: PropTypes.object,
  refetchQueries: PropTypes.array,
}

TextFormContainer.defaultProps = {
  data: { description: '' },
  mutationDoc: {},
  clientMutation: null,
  afterMutationHook: () => null,
  additionalFormData: {},
  refetchQueries: [],
}

export default TextFormContainer
