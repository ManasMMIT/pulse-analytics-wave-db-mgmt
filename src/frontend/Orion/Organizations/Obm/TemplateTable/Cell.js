import styled from '@emotion/styled'

const Cell = styled.div({
  padding: 8,
  fontSize: 12,
  ':first-of-type': {
    paddingLeft: 24,
  },
  ':last-child': {
    paddingRight: 24,
  },
})

export default Cell
