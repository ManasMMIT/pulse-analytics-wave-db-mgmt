import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import {
  FormLabel,
  FieldContainer,
  FieldsFormContainer,
  StyledInput,
  StyledButton,
} from './../../shared/styledComponents'

import { NEW_LIST_ITEM } from '../../utils/new-list-item'

const INVALID_LABEL_KEYS = [NEW_LIST_ITEM.labelKey, '']
const UNIQUE_KEY_ERROR = 'Key must be unique.'
const FORM_LABELS = {
  KEY_LABEL: 'Key (Required)',
  LABEL_LABEL: 'Label (Required)',
  NOTE_LABEL: 'Note (Tooltip)',
  VALUE_WRAPPER_TYPE_LABEL: 'Value Wrapper Type',
}
const VALUE_WRAPPER_TYPE_OPTIONS = [undefined, 'Tag', 'Star Rating']
const SUBMIT_LABEL = 'Save List Item'

const Form = ({ data, invalidLabelKeys, mutationFunc }) => {
  const originalLabelKey = data.labelKey
  const [stagedListItemLabelKey, setListItemLabelKey] = useState(data.labelKey)
  const [stagedListItemLabelName, setListItemLabelName] = useState(
    data.labelName
  )
  const [stagedListItemLabelInfo, setListItemLabelInfo] = useState(
    data.labelInfo
  )
  const [
    stagedListItemValueWrapperType,
    setListItemValueWrapperType,
  ] = useState(data.valueWrapperType)

  const saveField = () => {
    const isCreate = originalLabelKey === NEW_LIST_ITEM.labelKey
    const isUpdateSameKey = originalLabelKey !== stagedListItemLabelKey
    const isInvalidKey = invalidLabelKeys.includes(stagedListItemLabelKey)

    if (isCreate || isUpdateSameKey) {
      if (isInvalidKey) {
        alert(UNIQUE_KEY_ERROR)
        return
      }
    }

    const newListItem = {
      labelKey: stagedListItemLabelKey,
      labelName: stagedListItemLabelName,
      labelInfo: stagedListItemLabelInfo,
      valueWrapperType:
        stagedListItemValueWrapperType === undefined
          ? null
          : stagedListItemValueWrapperType,
    }

    mutationFunc(newListItem, originalLabelKey)
  }

  const handleLabelKeyChange = (e) => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setListItemLabelKey(value)
  }

  const handleLabelNameChange = (e) => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setListItemLabelName(value)
  }

  const handleLabelInfoChange = (e) => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setListItemLabelInfo(value)
  }

  const handleValueWrapperTypeSelection = (obj) =>
    setListItemValueWrapperType(obj.value)

  const valueWrapperTypeOptions = VALUE_WRAPPER_TYPE_OPTIONS.map(
    (valueWrapperType) => ({
      value: valueWrapperType,
      label: valueWrapperType === undefined ? '(BLANK)' : valueWrapperType,
    })
  )

  useEffect(() => {
    setListItemLabelKey(data.labelKey)
    setListItemLabelName(data.labelName)
    setListItemLabelInfo(data.labelInfo)
    setListItemValueWrapperType(data.valueWrapperType)
  }, [data])

  return (
    <FieldsFormContainer>
      <FieldContainer>
        <FormLabel>{FORM_LABELS.KEY_LABEL}</FormLabel>
        <StyledInput
          type="text"
          value={stagedListItemLabelKey || ''}
          onChange={handleLabelKeyChange}
          disabled={!data.labelKey}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>{FORM_LABELS.LABEL_LABEL}</FormLabel>
        <StyledInput
          type="text"
          value={stagedListItemLabelName || ''}
          onChange={handleLabelNameChange}
          disabled={!data.labelKey}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>{FORM_LABELS.NOTE_LABEL}</FormLabel>
        <StyledInput
          type="text"
          value={stagedListItemLabelInfo || ''}
          onChange={handleLabelInfoChange}
          disabled={!data.labelKey}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>{FORM_LABELS.VALUE_WRAPPER_TYPE_LABEL}</FormLabel>

        <Select
          styles={{ container: (base) => ({ ...base, flex: 1 }) }}
          value={{
            label: stagedListItemValueWrapperType || '',
            value: stagedListItemValueWrapperType || '',
          }}
          defaultValue={{
            label: stagedListItemValueWrapperType || '',
            value: stagedListItemValueWrapperType || '',
          }}
          onChange={handleValueWrapperTypeSelection}
          options={valueWrapperTypeOptions}
          isDisabled={!data.labelKey}
        />
      </FieldContainer>

      <StyledButton onClick={saveField} disabled={!data.labelKey}>
        {SUBMIT_LABEL}
      </StyledButton>
    </FieldsFormContainer>
  )
}

Form.propTypes = {
  data: PropTypes.object,
  invalidLabelKeys: PropTypes.array.isRequired,
  mutationFunc: PropTypes.func.isRequired,
}

Form.defaultProps = {
  data: {},
}

export default Form
