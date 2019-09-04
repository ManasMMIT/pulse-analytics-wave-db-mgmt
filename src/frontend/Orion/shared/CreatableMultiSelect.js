import React from 'react'
import _ from 'lodash'

import CreatableSelect from 'react-select/creatable'

const components = {
  DropdownIndicator: null,
};

const createOption = label => ({ label, value: label })

// Built off of example in https://react-select.com/creatable
class CreatableInputOnly extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputValue: '',
      value: props.value,
    };
  }

  handleChange = value => {
    const newValue = value || []

    // TODO: There's probably a better way to trigger the parent's effect
    this.setState(
      { inputValue: '', value: newValue },
      () => this.props.handleChange(newValue),
    )
  }

  handleInputChange = inputValue => this.setState({ inputValue })

  handleKeyDown = event => {
    const { inputValue, value } = this.state

    if (!inputValue) return

    // eslint-disable-next-line default-case
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        // guard against duplicate tags, which causes problems when attempting to persist
        const newValue = _.uniqBy([...value, createOption(inputValue)], 'value')

        this.handleChange(newValue)
        event.preventDefault()
    }
  }

  render() {
    const { inputValue, value } = this.state

    return (
      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder="Type a new tag and press enter..."
        value={value}
      />
    );
  }
}

export default CreatableInputOnly
