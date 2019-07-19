import React, { Component } from 'react'
import PropTypes from 'prop-types'

class SimpleForm extends Component {
  constructor(props) {
    super(props);
    const { data: { name, id }} = props;

    this.state = { name, id };
  }

  handleChange = e => {
    const value = e.currentTarget.value;

    this.setState({ name: value });
  }

  render() {
    const {
      state,
      handleChange,
      props: { editHandler },
    } = this;

    return (
      <form onSubmit={() => editHandler(state)}>
        <input
          type="text"
          onChange={handleChange}
          value={state.name}
        />
        <button type="submit">
          submit
        </button>
      </form>
    );
  }
}

SimpleForm.propTypes = {
  data: PropTypes.object,
  editHandler: PropTypes.func,
}

export default SimpleForm
