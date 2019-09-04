import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Mutation } from 'react-apollo'
import Spinner from '../../../Phoenix/shared/Spinner'

class TextForm extends Component {
  constructor(props) {
    super(props)

    this.state = props.data
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
        refetchQueryDoc,
      },
    } = this

    return (
      <div>
        { getInputFields(this.state, handleChange) }

        <Mutation
          mutation={mutationDoc}
          refetchQueries={[{ query: refetchQueryDoc }]}
        >
          {(handleSubmit, { loading, error }) => {
            if (loading) return <Spinner />
            if (error) return <div style={{ color: 'red' }}>Error processing request</div>

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

TextForm.propTypes = {
  data: PropTypes.object,
  mutationDoc: PropTypes.object,
  getInputFields: PropTypes.func,
}

TextForm.defaultProps = {
  data: { input: {} },
  mutationDoc: {},
  getInputFields: () => null,
}

export default TextForm
