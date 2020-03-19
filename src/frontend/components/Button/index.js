import styled from '@emotion/styled'

import Color from '../../utils/color'

const Button = styled.button({
  padding: '8px 12px',
  borderRadius: '4px',
  backgroundColor: Color.BLUE,
  color: '#FFF',
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 700,
  transition: 'opacity 250ms ease',
  whiteSpace: 'nowrap',
}, ({ buttonStyle, hoverStyle }) => ({
  ...buttonStyle,
  ':hover': {
    opacity: 0.8,
    ...hoverStyle
  }
}))

export default Button
