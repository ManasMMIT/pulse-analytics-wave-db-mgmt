import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import _ from 'lodash'

import FontSpace from '../../utils/fontspace'
import Spacing from '../../utils/spacing'
import Color from '../../utils/color'

const TitleWrapper = styled.div(
  {
    display: 'flex',
    textTransform: 'uppercase',
    fontWeight: 700,
    padding: Spacing.S4,
  },
  props => ({
    ...props.fontSpace,
    ...props.titleStyle,
  })
)

const TitleLabel = styled.div({
  color: Color.BLACK,
})

const TitleModifier = styled.div({
  color: Color.BLUE,
})

const Title = ({ title, titleModifiers, size, titleStyle }) => {
  const fontSpace = FontSpace[size]
  let formattedModifier

  if (!_.isEmpty(titleModifiers)) {
    formattedModifier = titleModifiers.map(modifier => {
      return (
        <Fragment key={modifier}>
          <span>&nbsp;/&nbsp;</span>
          <TitleModifier>{modifier}</TitleModifier>
        </Fragment>
      )
    })
  }

  return (
    <TitleWrapper fontSpace={fontSpace} titleStyle={titleStyle}>
      <TitleLabel>{title}</TitleLabel>
      {formattedModifier}
    </TitleWrapper>
  )
}

Title.propTypes = {
  title: PropTypes.string,
  titleModifiers: PropTypes.array,
  size: PropTypes.string,
  titleStyle: PropTypes.object,
}

Title.defaultProps = {
  title: 'Title Component',
  size: 'FS4',
  titleStyle: {},
  titleModifiers: [],
}

export default Title
