import React from 'react'
import styled from '@emotion/styled'

import FontSpace from 'frontend/utils/fontspace'

const Category = styled.div(
  {
    marginBottom: 16,
    fontWeight: 700,
    ...FontSpace.FS5,
  },
  ({ categoryStyle }) => categoryStyle
)

const Label = styled.div(
  {
    fontWeight: 700,
    ...FontSpace.FS2,
  },
  ({ labelStyle }) => labelStyle
)

const FormSelect = ({
  category,
  label,
  style,
  categoryStyle,
  labelStyle,
  children,
}) => {
  return (
    <div style={style}>
      <Category categoryStyle={categoryStyle}>{category}</Category>
      <Label labelStyle={labelStyle}>{label}</Label>
      {children}
    </div>
  )
}

export default FormSelect
