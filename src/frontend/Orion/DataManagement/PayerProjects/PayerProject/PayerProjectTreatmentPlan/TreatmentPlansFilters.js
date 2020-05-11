import React from 'react'
import styled from '@emotion/styled'
import Select from 'react-select'

import Color from '../../../../../utils/color'
import Spacing from '../../../../../utils/spacing'
import FontSpace from '../../../../../utils/fontspace'

const Wrapper = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  padding: `${Spacing.S4} ${Spacing.S4} 0`,
  background: Color.LIGHT_BLUE_GRAY_1,
  borderRadius: 4,
})

const SelectContainer = styled.div({
  width: '25%',
  padding: `0 ${Spacing.S3} ${Spacing.S4}`,
  ...FontSpace.FS3,
})

const colorStyles = {
  menu: provided => ({
    ...provided,
    zIndex: 3,
  }),
}

const TreatmentPlansFilters = ({
  selectedFilters,
  filtersConfig,
  setFilter,
}) => {
  const filters = filtersConfig.map(({ options, value, label }) => {
    const { selectedVal } = selectedFilters[value]
    const placeholder = `${label}(s)`

    return (
      <SelectContainer key={`${value}-multi-select`}>
        <Select
          placeholder={placeholder}
          isMulti
          value={selectedVal}
          options={options}
          onChange={e => setFilter(e, value)}
          styles={colorStyles}
        />
      </SelectContainer>
    )
  })

  return <Wrapper>{filters}</Wrapper>
}

export default TreatmentPlansFilters
