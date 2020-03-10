import React from 'react'
import _ from 'lodash'
import Select from 'react-select'
import styled from '@emotion/styled'

import useAquila from '../../../hooks/useAquila'

import Spacing from '../../../utils/spacing'
import FontSpace from '../../../utils/fontspace'
import Color from '../../../utils/color'

import FieldsSectionCard from '../../../components/FieldsSectionCard'

const generateCardInputs = fields => {
  const inputs = fields.reduce((result, field) => {
    const { key, options } = field
    result[key] = (<Select
      isMulti
      key={`query-tool-${ key }-input`}
      options={options}
    />)

    return result
  }, {})

  return inputs
}

const generatePanel = filterOption => {
  const { fields } = filterOption
  const inputs = generateCardInputs(fields)

  return (
    <FieldsSectionCard
      data={filterOption}
      inputs={inputs}
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
  const {
    setPql,
    data: {
      pql,
      results,
      filterOptions
    },
    loading,
    submitPql,
  } = useAquila()

  const optionsLoaded = !_.isEmpty(filterOptions)

  return (
    <Wrapper>
      <h1 style={{ padding: Spacing.S4, ...FontSpace.FS4 }}>Query Tool</h1>
      <FiltersContainer>
        { optionsLoaded && filterOptions.map(filterOption => generatePanel(filterOption)) }
      </FiltersContainer>
    </Wrapper>
  )
}

export default QueryTool
