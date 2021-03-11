import PropTypes from 'prop-types'
import React from 'react'
import Select from 'react-select'
import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import { customSelectStyles } from 'frontend/components/customSelectStyles'

import Color from 'frontend/utils/color'
import Icon from '../Icon'

const CreateOptionWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: Color.PRIMARY,
  cursor: 'pointer',
  justifyContent: 'space-between',
})

const CreateOption = ({ clickHandler, createOptionText }) => {
  return (
    <div>
      <CreateOptionWrapper onClick={clickHandler}>
        <div>{createOptionText}</div>
        <Icon iconName="add" color1={Color.PRIMARY} width={16} />
      </CreateOptionWrapper>
    </div>
  )
}

const getSelectProps = ({
  data,
  selectedId,
  getLabel,
  createOptionText,
  clickHandler,
}) => {
  const entities = Object.values(data)[0] || []

  const options = entities.map((entity) => ({
    label: getLabel(entity),
    value: entity._id,
  }))

  const CreateOptionLabel = (
    <CreateOption
      clickHandler={clickHandler}
      createOptionText={createOptionText}
    />
  )

  const selectedEntity = entities.find(({ _id }) => _id === selectedId)
  const value = selectedEntity
    ? { label: selectedEntity.organization, value: selectedEntity._id }
    : null

  return {
    value,
    options: [{ label: CreateOptionLabel, value: null }, ...options],
  }
}

const filterOption = (option, inputValue) => {
  const { value, label } = option
  return value === null
    ? true
    : label.toLowerCase().includes(inputValue.toLowerCase())
}

const BoPowerSelectNew = ({
  changeHandler,
  queryDoc,
  getLabel,
  placeholder,
  selectedId,
  createOptionConfig,
}) => {
  const { data, loading } = useQuery(queryDoc)

  if (loading) return null

  const { value, options } = getSelectProps({
    data,
    selectedId,
    getLabel,
    ...createOptionConfig,
  })

  return (
    <div style={{ margin: 12, minWidth: 200 }}>
      <Select
        placeholder={placeholder}
        styles={customSelectStyles}
        value={value}
        options={options}
        onChange={changeHandler}
        filterOption={filterOption}
      />
    </div>
  )
}

BoPowerSelectNew.propTypes = {
  changeHandler: PropTypes.func.isRequired,
  getLabel: PropTypes.func.isRequired,
  queryDoc: PropTypes.object.isRequired,
  noOptionsConfig: PropTypes.object,
  placeholder: PropTypes.string,
  selectedId: PropTypes.string,
}

BoPowerSelectNew.defaultProps = {
  selectedId: null,
  noOptionsConfig: null,
  placeholder: '',
}

const BoPowerSelectNewContainer = (props) => {
  if (!props.queryDoc) return null

  return <BoPowerSelectNew {...props} />
}

export default BoPowerSelectNewContainer
