import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Mutation } from 'react-apollo'
import Spinner from '../../../Phoenix/shared/Spinner'
import stripTypename from '../strip-typename'

class Form extends Component {
  constructor(props) {
    super(props)

    this.state = stripTypename(props.data)
  }

  handleChange = e => {
    const {
      value,
      name,
    } = e.target

    const newState = _.cloneDeep(this.state)

    // overwrite rather than merge in case the value is an array
    newState.input[name] = value

    this.setState(newState)
  }

  render() {
    const {
      state,
      handleChange,
      props: {
        getInputFields,
        mutationDoc,
        afterSubmitHook,
        afterMutationHook,
        refetchQueries,
        style,
      },
    } = this

    return (
      <div style={style}>
        { getInputFields(this.state, handleChange) }

        <Mutation
          mutation={mutationDoc}
          refetchQueries={refetchQueries}
          update={afterMutationHook}
        >
          {(handleSubmit, { loading, error }) => {
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
          }}
        </Mutation>
      </div>
    );
  }
}

Form.propTypes = {
  style: PropTypes.object, 
  data: PropTypes.object,
  mutationDoc: PropTypes.object,
  getInputFields: PropTypes.func,
  afterSubmitHook: PropTypes.func,
  afterMutationHook: PropTypes.func,
  refetchQueries: PropTypes.arrayOf(PropTypes.object),
}

Form.defaultProps = {
  style: {},
  data: { input: {} },
  mutationDoc: {},
  getInputFields: () => null,
  afterSubmitHook: () => null,
  afterMutationHook: () => null,
  refetchQueries: [],
}

export default Form
