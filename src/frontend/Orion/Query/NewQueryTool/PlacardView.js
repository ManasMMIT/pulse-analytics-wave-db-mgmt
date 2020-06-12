import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import _ from 'lodash'
import styled from '@emotion/styled'

// ! Only for refetchQueries
import {
  GET_AQUILA_BO_FILTER_SETTINGS,
  GET_AQUILA_PQL_RESULTS,
} from 'frontend/api/queries'

import QueryToolTable from './QueryToolTable'

import usePql from '../../../hooks/usePql'
import useAquilaBusinessObjects from './utils/useAquilaBusinessObjects'
import usePqlObject from './utils/usePqlObject'
import getPqlFromConfigs from './utils/getPqlFromConfigs'

import generatePanel from './utils/generatePanel'

import Spacing from '../../../utils/spacing'
import Color from '../../../utils/color'

import Button from '../../../components/Button'
import Icon from '../../../components/Icon'

const FiltersContainer = styled.div({
  display: 'flex',
  margin: Spacing.S4,
  padding: Spacing.S4,
  border: '1px solid black',
  borderRadius: 4,
  background: Color.WHITE,
})

const PlacardView = () => {
  const [
    filtersState,
    setFiltersState,
  ] = useState([])

  const {
    setPql,
    data: { pql, results },
    loading: pqlLoading,
    submitPql,
  } = usePql()

  const {
    data: { aquilaBusinessObjects, boFilterSettings },
    getBoFilterSettings,
    loading: boFilterSettingsLoading,
  } = useAquilaBusinessObjects()

  const {
    data: pqlObjectData,
    loading: pqlObjectLoading,
  } = usePqlObject(pql)

  const businessObjectName = pql.match(/[\w\s]+={.*}/) && pql.match(/[\w\s]+=/)[0].replace('=', '')

  const options = (aquilaBusinessObjects || []).map(({ boName, boId }) => ({ label: boName, value: boId }))

  let selectedOption = null
  if (businessObjectName) {
    selectedOption = options.find(({ label: boName }) => boName === businessObjectName)
  }

  useEffect(() => {
    const shouldClean = !filtersState.length
      && !_.isEmpty(boFilterSettings)
      && !pqlObjectLoading

    if (shouldClean) {
      const { pqlObject: { params } } = pqlObjectData

      const cleanFiltersState = getCleanFiltersState(boFilterSettings, params)

      setFiltersState(cleanFiltersState)

      const cleanPql = getPqlFromConfigs({
        businessObjectName,
        configs: cleanFiltersState,
      })

      setPql(cleanPql)
    }
    // ! on mount or when business objects are selected, the dependency array will recognize a diff
  }, [pqlObjectLoading, boFilterSettings])

  useEffect(() => {
    const shouldFetchBoFilterSettings = aquilaBusinessObjects && selectedOption

    if (shouldFetchBoFilterSettings) {
      getBoFilterSettings({
        variables: {
          boId: selectedOption.value,
        }
      })
    }

    if (pql.length) submitPql(pql)
  }, [pql, aquilaBusinessObjects])

  useEffect(() => {
    const cleanFiltersState = getCleanFiltersState(boFilterSettings, filtersState)

    setFiltersState(cleanFiltersState)
  }, [pql])

  if (_.isEmpty(aquilaBusinessObjects)) return null

  const setFiltersAndPqlPostMutation = getSetFiltersAndPqlPostMutation(
    filtersState,
    setFiltersState,
    businessObjectName,
    setPql,
  )

  const shouldRenderPanel = !_.isEmpty(boFilterSettings) && !pqlObjectLoading

  return (
    <>
      <Button
        iconName="add"
        iconPosition="left"
        iconColor1={Color.WHITE}
        onClick={() => submitPql(pql)}
      >
        Submit Form
      </Button>
      <Icon
        iconName="check-box"
      />

      <Select
        value={selectedOption}
        options={options}
        onChange={({ label }) => {
          setFiltersState([])
          setPql(`${label}={}`)
        }}
      />

      <FiltersContainer>
        {shouldRenderPanel && generatePanel({
          pqlObject: pqlObjectData.pqlObject,
          boFilterSettings,
          setFiltersState,
          filtersState,
          setPql,
          businessObjectName,
        }) }
      </FiltersContainer>
      <QueryToolTable
        data={results}
        loading={pqlLoading || boFilterSettingsLoading}
        businessObjectName={businessObjectName}
        refetchQueries={[
          { query: GET_AQUILA_BO_FILTER_SETTINGS, variables: { boId: (selectedOption || {}).value } },
          { query: GET_AQUILA_PQL_RESULTS, variables: { pql } },
        ]}
        afterMutationHook={setFiltersAndPqlPostMutation}
      />
    </>
  )
}

export default PlacardView

const getCleanFiltersState = (
  boFilterSettings,
  filtersState
) => {
  const boFilterFieldsByKey = _.keyBy(
    boFilterSettings.fields,
    'boFieldKey'
  )

  const cleanFiltersState = filtersState.map(({
    key,
    options
  }) => {
    if (!boFilterFieldsByKey[key]) return { key, options }

    const { inputProps: { options: filterOptions } } = boFilterFieldsByKey[key]

    const cleanOptions = options.filter(({ value }) => {
      return filterOptions.includes(value)
    })

    return { key, options: cleanOptions }
  })

  return cleanFiltersState
}

const getSetFiltersAndPqlPostMutation = (
  filtersState,
  setFiltersState,
  businessObjectName,
  setPql,
) => {
  return data => {
    const datum = Object.values(data)[0]
    const newFiltersState = _.cloneDeep(filtersState)

    newFiltersState.forEach(filter => addNewOptions(filter, datum))

    setFiltersState(newFiltersState)

    const pqlWithAdditionalOptions = getPqlFromConfigs({
      businessObjectName,
      configs: newFiltersState,
    })

    setPql(pqlWithAdditionalOptions)
  }
}

const addNewOptions = ({ key, options }, datum) => {
  const datumValue = datum[key]

  if (!datumValue) return

  const isInOptions = options.find(({ value: filterOptionValue }) => filterOptionValue === datumValue)
  if (_.isEmpty(isInOptions)) {
    options.push({ label: datumValue, value: datumValue })
  }
}
