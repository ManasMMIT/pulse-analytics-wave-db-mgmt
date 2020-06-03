import React from 'react'
import _ from 'lodash'
import getPqlFromConfigs from './getPqlFromConfigs'

import FieldsSectionCard from '../../../../components/FieldsSectionCard'

const generatePanel = ({
  pqlObject,
  placardOptions,
  setFiltersState,
  filtersState,
  setPql,
  businessObjectName,
}) => {
  const { label, fields } = placardOptions

  const fieldsConfig = fields
    .map(({ boFieldKey, label, inputProps }) => {
      const clonedInputProps = _.cloneDeep(inputProps)

      clonedInputProps.options = clonedInputProps.options.map(option => ({ value: option, label: option }))

      const onChangeHandler = getOnChangeHandler({
        filtersState,
        boFieldKey,
        businessObjectName,
        setFiltersState,
        setPql,
      })

      let defaultValue
      if (pqlObject && pqlObject.params && pqlObject.params.length) {
        const matchingKeyParams = pqlObject.params
          .find(({ key }) => key === boFieldKey)

        defaultValue = matchingKeyParams
          ? matchingKeyParams.options
          : null
      }

      return {
        key: boFieldKey,
        inputComponent: "Select",
        label,
        inputProps: {
          // ? guessing at reasonable defaults for inputProps
          isMulti: true,
          isClearable: true,

          // ! injected on mount by placard view
          defaultValue,

          // * likely fixed props
          ...clonedInputProps,
          onChange: onChangeHandler,
        },
      }
    })

  return (
    <FieldsSectionCard
      key={`query-tool-${label}-card`}
      label={label}
      fields={fieldsConfig}
      containerStyle={{ width: '50%' }}
    />
  )
}

const getOnChangeHandler = ({
  filtersState,
  boFieldKey,
  businessObjectName,
  setFiltersState,
  setPql,
}) => options => {
  // ! options can be an object or array of objects
  const stabilizedDataTypeOptions = _.isArray(options)
    ? options
    : [options]

  const indexOfKeyConfig = filtersState.findIndex(({ key }) => key === boFieldKey)

  let newFiltersState = filtersState
  if (!_.isEmpty(options)) {
    newFiltersState = indexOfKeyConfig === -1
      ? [
          ...filtersState,
          {
            key: boFieldKey,
            options: stabilizedDataTypeOptions,
          },
        ]
      : [
          ...filtersState.slice(0, indexOfKeyConfig),
          {
            key: boFieldKey,
            options: stabilizedDataTypeOptions,
          },
          ...filtersState.slice(indexOfKeyConfig + 1),
        ]
  } else {
    filtersState.splice(indexOfKeyConfig, 1)
  }

  setFiltersState(newFiltersState)

  const newPql = getPqlFromConfigs({
    businessObjectName,
    configs: newFiltersState,
  })

  setPql(newPql)
}

export default generatePanel
