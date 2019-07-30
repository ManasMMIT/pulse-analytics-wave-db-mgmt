import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Mutation } from 'react-apollo'

class TextForm extends Component {
  constructor(props) {
    super(props)
    const { data: { description } } = props

    this.state = { description }
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
      props: { mutationDoc, afterSubmitHook },
    } = this

    return (
      <div>
        <input
          type="text"
          name={"description"}
          onChange={handleChange}
          value={state.description}
        />

        <Mutation mutation={mutationDoc}>
          {handleSubmit => (
            <button
              type="submit"
              onClick={() => handleSubmit({ variables: state }).then(afterSubmitHook)}
            >
              submit
            </button>
          )}
        </Mutation>
      </div>
    );
  }
}

TextForm.propTypes = {
  data: PropTypes.object,
  mutationDoc: PropTypes.object,
}

TextForm.defaultProps = {
  data: { description: '' },
  mutationDoc: {},
}

export default TextForm
