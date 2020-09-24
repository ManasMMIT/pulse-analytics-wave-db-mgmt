import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

import { mix } from 'polished'
import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

export const SublistHeaderRowContainer = styled.div(
  {
    fontSize: 10,
    fontWeight: 700,
    lineHeight: '18px',
    padding: `${Spacing.S3} ${Spacing.S7}`,
    position: 'sticky',
    textTransform: 'uppercase',
    top: 0,
    zIndex: 5,
  },
  ({ rowColor }) => ({
    background: mix(0.8, Color.WHITE, rowColor),
    color: rowColor,
  })
)

const SublistHeaderRow = ({ text, rowColor, children }) => {
  return (
    <SublistHeaderRowContainer rowColor={rowColor}>
      {text}
    </SublistHeaderRowContainer>
  )
}

SublistHeaderRow.propTypes = {
  children: PropTypes.node,
  rowColor: PropTypes.string,
}

SublistHeaderRow.defaultProps = {
  children: null,
  rowColor: Color.LIGHT_GRAY_1,
}

export default SublistHeaderRow
