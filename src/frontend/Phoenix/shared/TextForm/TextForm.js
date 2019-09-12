import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation, withApollo } from 'react-apollo'

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
      name
    } = e.target

    this.setState({ [name]: value })
  }

  render() {
    const {
      state,
      handleChange,
      props: {
        mutationDoc,
        afterSubmitHook,
        clientMutation,
        client,
      },
    } = this

    const updateClientMutationCallback = (cache, { data }) => {
      client.mutate({
        mutation: clientMutation,
        variables: { data },
      })
    }

    return (
      <div>
        <input
          type="text"
          name={"description"}
          onChange={handleChange}
          value={state.description}
        />

        <Mutation
          mutation={mutationDoc}
          update={updateClientMutationCallback}
        >
          {(handleSubmit, { loading, error }) => {
            if (loading) return <Spinner />
            if (error) return <div style={{ color: 'red' }}>Error processing request</div>

            return (
              <button
                type="submit"
                onClick={() => handleSubmit({ variables: { input: state } }).then(afterSubmitHook)}
              >
                submit
              </button>
            )
          }}
        </Mutation>
      </div>
    );
  }
}

TextForm.propTypes = {
  data: PropTypes.object,
  mutationDoc: PropTypes.object,
  afterMutationHook: PropTypes.func,
  clientMutation: PropTypes.object,
  additionalFormData: PropTypes.object,
}

TextForm.defaultProps = {
  data: { description: '' },
  mutationDoc: {},
  clientMutation: {},
  afterMutationHook: () => null,
  additionalFormData: {},
}

export default withApollo(TextForm)
