import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
      props: { handleSubmit },
    } = this

    return (
      <div>
        <input
          type="text"
          name={"description"}
          onChange={handleChange}
          value={state.description}
        />
        <button type="submit" onClick={() => handleSubmit(state)}>
          submit
        </button>
      </div>
    );
  }
}

TextForm.propTypes = {
  data: PropTypes.object,
  handleSubmit: PropTypes.func,
}

export default TextForm
