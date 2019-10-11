import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import stripTypename from '../strip-typename'
import SubmitButton from './SubmitButton'

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

        <SubmitButton
          state={state}
          mutationDoc={mutationDoc}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
          afterSubmitHook={afterSubmitHook}
        />
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
