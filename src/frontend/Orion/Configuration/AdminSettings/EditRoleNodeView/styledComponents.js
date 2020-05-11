import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors } from '../../../../utils/pulseStyles'

export const FormLabel = styled.div({
  color: Colors.BLACK,
  fontSize: 14,
  fontWeight: 700,
  marginBottom: '24px',
  textTransform: 'uppercase',
})

export const InputContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 24,
})

export const InputLabel = styled.label({
  color: Colors.BLACK,
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 8,
})

const sharedInputStyles = {
  background: Colors.WHITE,
  border: '1px solid',
  borderColor: 'transparent',
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 400,
  padding: 6,
}

const sharedInputHoverStyles = {
  borderColor: transparentize(0.5, Colors.BLACK),
}

const sharedInputFocusStyles = {
  borderColor: Colors.PRIMARY,
  outline: `1px solid ${Colors.PRIMARY}`,
}

export const StyledInput = styled.input({
  ...sharedInputStyles,
  ':hover': {
    ...sharedInputHoverStyles,
  },
  ':focus': {
    ...sharedInputFocusStyles,
  },
})


export const StyledButton = styled.button({
  background: transparentize(0.85, Colors.PRIMARY),
  border: 'none',
  borderRadius: 4,
  color: Colors.PRIMARY,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  marginLeft: 8,
  padding: '8px 12px',
  height: 'fit-content',
  ':hover': {
    background: transparentize(0.7, Colors.PRIMARY),
  },
  ':focus': {
    boxShadow: '0 0 0 2px',
  },
  ':active': {
    background: transparentize(0.5, Colors.PRIMARY),
  }
})
