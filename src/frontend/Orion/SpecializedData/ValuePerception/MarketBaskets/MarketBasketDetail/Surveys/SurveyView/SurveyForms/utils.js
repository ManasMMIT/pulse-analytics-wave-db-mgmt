import React from 'react'
import styled from '@emotion/styled'
import { Button } from '@pulse-analytics/pulse-design-system'

import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import Color from 'frontend/utils/color'

export const EDIT_SURVEY_TYPE = 'edit-survey'
export const CREATE_STAKEHOLDER_TYPE = 'create-stakeholder'
export const IMPORT_EXPORT_SURVEY_TYPE = 'import-export-survey'

export const InputSection = styled.section({
  display: 'flex',
  flexDirection: 'column',
  padding: `${Spacing.S4} 0`,
})

export const FormLabel = styled.label({
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '20px',
  padding: `${Spacing.S3} 0`,
})

// ! claire TODO: hack styled should be moves into DS
export const StyledButton = (props) => (
  <Button
    {...props}
    style={{
      padding: `${Spacing.S2} ${Spacing.S3}`,
      margin: `${Spacing.S4} 6px`,
      ...FontSpace.FS2,
    }}
  />
)

export const ModalHeader = styled.h2({
  fontWeight: 700,
  ...FontSpace.FS6,
})

export const BlueText = styled.span({
  color: Color.PRIMARY,
})
