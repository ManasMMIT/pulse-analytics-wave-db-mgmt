import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import format from 'date-fns/format'

import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'

const ListItemComponent = styled.li({
  margin: Spacing.S4,
  borderRadius: 4,
  padding: `${Spacing.S3} ${Spacing.S4}`,
  textDecoration: 'none',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: '20px',
  cursor: 'pointer',
  ':hover': {
    background: transparentize(0.9, Color.PRIMARY),
  },
})

const defaultInactiveStyle = {
  color: transparentize(0.4, Color.BLACK),
}

const defaultActiveStyle = {
  color: Color.PRIMARY,
  background: transparentize(0.9, Color.PRIMARY),
}

const ListItem = ({ survey, setSurvey, selectedSurveyId }) => {
  const { id, date } = survey
  const isSelected = id === selectedSurveyId
  const style = isSelected ? defaultActiveStyle : defaultInactiveStyle
  const formattedDate = format(new Date(date), 'PP')

  return (
    <ListItemComponent key={date} onClick={() => setSurvey(id)} style={style}>
      {formattedDate}
    </ListItemComponent>
  )
}

ListItem.propTypes = {
  survey: PropTypes.object.isRequired,
  setSurvey: PropTypes.func.isRequired,
  selectedSurveyId: PropTypes.string,
}

ListItem.defaultProps = {
  selectedSurveyId: null,
}

export default ListItem
