import React from 'react'
import _ from 'lodash'

import CreatableSelect from 'react-select/creatable'

import { transparentize } from 'polished'

import { Colors, Spacing } from '../../utils/pulseStyles'

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

    const customStyles = {
      control: (provided,) => ({
        ...provided,
        borderRadius: 4,
        border: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
      }),
      multiValue: () => ({
        background: transparentize(0.9, Colors.BLACK),
        borderRadius: 4,
        display: 'flex',
        marginRight: Spacing.SMALL
      }),
      multiValueLabel: () => ({
        fontSize: 12,
        color: Colors.BLACK,
        marginLeft: Spacing.TINY,
        padding: Spacing.TINY,
      }),
      placeholder: () => ({
        fontSize: 12,
        color: transparentize(0.7, Colors.BLACK),
      }),
      menuList: (provided) => ({
        ...provided,
        fontSize: 12,
      }),
      input: (provided) => ({
        ...provided,
        fontSize: 12,
      }),
    }

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
        placeholder="Type a new entry and press enter..."
        value={value}
        styles={customStyles}
      />
    );
  }
}

export default CreatableInputOnly
