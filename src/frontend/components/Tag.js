import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import { transparentize } from 'polished'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

const TagContainer = styled.span(
  {
    ...FontSpace.FS1,
    borderRadius: 2,
    fontWeight: 500,
    lineHeight: '16px',
    padding: `${Spacing.S1} ${Spacing.S2}`,
  },
  ({ color }) => ({
    color,
    background: transparentize(0.8, color),
  })
)

const Tag = ({ text, color, style }) => {
  return (
    <TagContainer style={style} color={color}>
      {text}
    </TagContainer>
  )
}

Tag.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  style: PropTypes.object,
}

Tag.defaultProps = {
  color: Color.BLACK,
  style: {},
}

export default Tag
