import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import styled from '@emotion/styled'

import useAquila from '../../../hooks/useAquila'

import Spacing from '../../../utils/spacing'
import FontSpace from '../../../utils/fontspace'
import Color from '../../../utils/color'

import FieldsSectionCard from '../../../components/FieldsSectionCard'

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

const Wrapper = styled.div({
  width: '100%',
  padding: Spacing.S4,
  background: Color.LIGHT_BLUE_GRAY_1,
})

const FiltersContainer = styled.div({
  display: 'flex',
  margin: Spacing.S4,
  padding: Spacing.S4,
  border: '1px solid black',
  borderRadius: 4,
  background: Color.WHITE,
})

const QueryTool = () => {
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

  return (
    <Wrapper>
      <h1 style={{ padding: Spacing.S4, ...FontSpace.FS4 }}>Query Tool</h1>
      <FiltersContainer>
        { optionsLoaded && generatePanel(placardOptions) }
      </FiltersContainer>
    </Wrapper>
  )
}

export default QueryTool
