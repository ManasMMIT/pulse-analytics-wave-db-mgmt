import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import styled from '@emotion/styled'

// ! Don't use table until filters can be loaded from pql
// import QueryToolTable from './QueryToolTable'
import useAquila from '../../../hooks/useAquila'

import Spacing from '../../../utils/spacing'
import Color from '../../../utils/color'

import FieldsSectionCard from '../../../components/FieldsSectionCard'
import Button from '../../../components/Button'
import Icon from '../../../components/Icon'

const generatePanel = filterOption => {
  const { name, fields } = filterOption

  const fieldsConfig = fields.map(field => {
    const { key, label, inputComponent, inputProps } = field
    return ({
      key,
      label,
      inputComponent,
      inputProps,
    })
  })

  return (
    <FieldsSectionCard
      key={`query-tool-${ name }-card`}
      label={name}
      fields={fieldsConfig}
      containerStyle={{ width: '50%' }}
    />
  )
}

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

  const {
    setPql,
    data: { pql, results },
    getFilterConfigOptions,
    getPlacardOptions,
    loading,
    submitPql,
  } = useAquila()

  useEffect(() => {
    getPlacardOptions().then(result => {
      setPlacardOptions(result)
    })

    getFilterConfigOptions().then(result => {
      setFilterConfigOptions(result)
    })
  }, [])

  const optionsLoaded = !_.isEmpty(placardOptions)

  // const businessObjectName = pql.match(/[\w\s]+={.*}/) && pql.match(/[\w\s]+=/)[0].replace('=', '')

  return (
    <>
      <Button
        iconName="add"
        iconPosition="left"
        iconColor1={Color.WHITE}
      >
        Submit Form
      </Button>
      <Icon
        iconName="check-box"
      />
      <FiltersContainer>
        { optionsLoaded && generatePanel(placardOptions) }
      </FiltersContainer>
      {/* <QueryToolTable
        data={results}
        loading={loading}
        businessObjectName={businessObjectName}
        afterMutationHook={() => submitPql(pql)}
      /> */}
    </>
  )
}

export default PlacardView
