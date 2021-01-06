// ! This component isn't finished and is only a placeholder.
// TODO: Actually make a quarter picker component

import React from 'react'
import styled from '@emotion/styled'
import Input from 'frontend/components/Input'

import { isoShortToYearQuarter } from 'frontend/utils/formatDate'

const YearQuarterText = styled.div({
  left: 2,
  top: 2,
  position: 'absolute',
  background: 'white',
  height: 35,
  display: 'flex',
  alignItems: 'center',
  width: 125,
  borderRadius: 10,
})

const QuarterPicker = ({ value, name, onChange }) => (
  <div style={{ position: 'relative' }}>
    <YearQuarterText>
      <p style={{ marginLeft: 12 }}>{value && isoShortToYearQuarter(value)}</p>
    </YearQuarterText>
    <Input type="date" value={value} name={name} onChange={onChange} />
  </div>
)

export default QuarterPicker
