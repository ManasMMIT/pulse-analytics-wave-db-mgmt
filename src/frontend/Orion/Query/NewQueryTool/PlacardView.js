import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import _ from 'lodash'
import styled from '@emotion/styled'

// ! Don't use table until filters can be loaded from pql
import QueryToolTable from './QueryToolTable'
import useAquila from '../../../hooks/useAquila'

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
    filterConfigOptions,
    setFilterConfigOptions,
  ] = useState([])

  const [
    placardOptions,
    setPlacardOptions,
  ] = useState([])

  const [
    filtersState,
    setFiltersState,
  ] = useState([])

  const {
    setPql,
    data: { pql, results },
    getFilterConfigOptions,
    getPlacardOptions,
    loading,
    submitPql,
  } = useAquila()

  useEffect(() => {
    getFilterConfigOptions().then(setFilterConfigOptions)
  }, [])

  const businessObjectName = pql.match(/[\w\s]+={.*}/) && pql.match(/[\w\s]+=/)[0].replace('=', '')

  const options = filterConfigOptions.map(({ boName, boId }) => ({ label: boName, value: boId }))

  let selectedOption = null
  if (businessObjectName) {
    selectedOption = options.find(({ label: boName }) => boName === businessObjectName)
  }

  useEffect(() => {
    const shouldFetchPlacardOptions = filterConfigOptions.length && selectedOption

    if (shouldFetchPlacardOptions) {
      getPlacardOptions(selectedOption.value).then(setPlacardOptions)
    }

    submitPql(pql)
  }, [pql, filterConfigOptions])

  if (_.isEmpty(filterConfigOptions)) return null

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
        {!_.isEmpty(placardOptions) && generatePanel({
          placardOptions,
          setFiltersState,
          filtersState,
          setPql,
          businessObjectName,
        }) }
      </FiltersContainer>
      <QueryToolTable
        data={results}
        loading={loading}
        businessObjectName={businessObjectName}
        afterMutationHook={() => submitPql(pql)}
      />
    </>
  )
}

export default PlacardView
