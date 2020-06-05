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

  const options = aquilaBusinessObjects.map(({ boName, boId }) => ({ label: boName, value: boId }))

  let selectedOption = null
  if (businessObjectName) {
    selectedOption = options.find(({ label: boName }) => boName === businessObjectName)
  }

  useEffect(() => {
    if (!pqlObjectLoading) {
      const { pqlObject: { params } } = pqlObjectData

      setFiltersState(params)
    }
  }, [pqlObjectLoading])

  useEffect(() => {
    const shouldFetchBoFilterSettings = aquilaBusinessObjects.length && selectedOption

    if (shouldFetchBoFilterSettings) {
      getBoFilterSettings({
        variables: {
          boId: selectedOption.value,
        }
      })
    }

    if (pql.length) submitPql(pql)
  }, [pql, aquilaBusinessObjects])

  if (_.isEmpty(aquilaBusinessObjects)) return null

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
        {!_.isEmpty(boFilterSettings) && !pqlObjectLoading && generatePanel({
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
      />
    </>
  )
}

export default PlacardView
