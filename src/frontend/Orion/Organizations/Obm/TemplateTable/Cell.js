import styled from '@emotion/styled'
import Color from 'frontend/utils/color'

const Cell = styled.div({
  padding: 8,
  fontSize: 12,
  ':first-child': {
    paddingLeft: 24,
  },
  ':last-child': {
    paddingRight: 24,
  },
})

export default Cell
