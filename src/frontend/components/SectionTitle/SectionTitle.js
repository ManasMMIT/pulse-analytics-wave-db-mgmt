import React from 'react'
import PropTypes from 'prop-types'

import styled from '@emotion/styled'
import { transparentize } from 'polished'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'

const SectionHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  borderBottom: `2px solid ${transparentize(0.9, Color.BLACK)}`,
  padding: Spacing.S4,
})

const SectionLabel = styled.h2({
  ...FontSpace.FS4,
  color: Color.BLACK,
  padding: `0 ${Spacing.S4}`,
})

const SectionTitle = ({ title, titleStyle, children }) => {
  return (
    <SectionHeader>
      <SectionLabel style={titleStyle}>{title}</SectionLabel>
      {children}
    </SectionHeader>
  )
}

SectionTitle.propTypes = {
  title: PropTypes.string,
  titleStyle: PropTypes.object,
  children: PropTypes.node,
}

SectionTitle.defaultProps = {
  title: '',
  titleStyle: {},
  children: null,
}

export default SectionTitle
