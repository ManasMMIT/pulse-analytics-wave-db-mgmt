import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors } from '../../../../../utils/pulseStyles'

export const ListContainer = styled.div({
  borderRight: `2px solid ${transparentize(0.9, Colors.BLACK)}`,
  height: '100%',
  overflowY: 'scroll',
})

export const ListHeader = styled.div({
  alignItems: 'center',
  background: Colors.WHITE,
  borderBottom: `2px solid ${transparentize(0.9, Colors.BLACK)}`,
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 24px',
  position: 'sticky',
  top: 0,
})

export const ListTitle = styled.h2({
  color: Colors.BLACK,
  fontSize: 14,
  fontWeight: 700,
  textTransform: 'uppercase',
})

export const StyledUnorderedList = styled.ul({
  listStyle: 'none',
  margin: 0,
  padding: 0,
})

export const ListItem = styled.li({
  alignItems: 'center',
  background: Colors.WHITE,
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 24px',
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '22px',
  cursor: 'pointer',
  ':hover': {
    background: transparentize(0.95, Colors.BLACK),
  },
})

export const UpdateFormLabel = styled.div({
  color: Colors.BLACK,
  fontSize: 14,
  fontWeight: 700,
  padding: '24px 24px 12px',
  textTransform: 'uppercase',
})

export const FieldsFormContainer = styled.div({
  height: '100%',
  padding: 24,
})

export const FieldContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 24,
})

export const FormLabel = styled.label({
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
  padding: 12,
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

export const StyledTextarea = styled.textarea({
  ...sharedInputStyles,
  height: 200,
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
  },
})
