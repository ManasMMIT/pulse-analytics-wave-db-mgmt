import React, { useRef } from 'react'
import styled from '@emotion/styled'

import FilterMenu from '../FilterMenu'
import FieldLabel from '../FieldLabel'
import Button from '../Button'

import generateCardInput from './utils'

import Spacing from '../../utils/spacing'
import Color from '../../utils/color'

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: Spacing.S4,
  background: Color.LIGHT_BLUE_GRAY_1,
  borderRadius: 4,
}, ({ style }) => style)

const FieldsSectionCardWithMenu = ({
  label,
  fields,
  containerStyle,
  removeCardCb,
  menuProps,
}) => {
  const anchorEl = useRef()

  const { isMenuOpen, toggleMenu, onClickAway, options } = menuProps

  return (
    <Wrapper style={containerStyle}>
      <FieldLabel isCardLabel removeCb={removeCardCb}>
        { label }
      </FieldLabel>
      { fields.map(generateCardInput) }
      <Button
        ref={anchorEl}
        onClick={() => toggleMenu(!isMenuOpen)}
      >
        +
      </Button>
      <FilterMenu
        anchorEl={anchorEl.current}
        isMenuOpen={isMenuOpen}
        onClickAway={onClickAway}
        options={options}
        label={'with-panel'}
      />
    </Wrapper>
  )
}

export default FieldsSectionCardWithMenu