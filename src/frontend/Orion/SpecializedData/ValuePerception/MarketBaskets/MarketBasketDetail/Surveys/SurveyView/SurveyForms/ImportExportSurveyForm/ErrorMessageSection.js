import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'

const ImportFailedMessage = styled.p({
  color: Color.RED,
  fontWeight: 600,
  ...FontSpace.FS1,
})

const ErrorSection = styled.section({
  background: transparentize(0.85, Color.RED),
  margin: `${Spacing.S4} 0`,
  borderRadius: 4,
  ...FontSpace.FS1,
})

const BoldText = styled.span({
  fontWeight: 600,
})

const ErrorMessageSection = ({ errors }) => {
  const parsedErrors = JSON.parse(errors.replace('GraphQL error: Error: ', ''))

  const errorMessages = parsedErrors.map(({ column, rowIdx, error }) => {
    const { errorMessage, value } = error

    return (
      <div
        key={`${column} - ${rowIdx}`}
        style={{ padding: Spacing.S4, color: Color.RED }}
      >
        <p>
          Column: <BoldText>{column}</BoldText>, Row:{' '}
          <BoldText>{rowIdx}</BoldText>
        </p>
        <p style={{ padding: `0 ${Spacing.S3}` }}>
          - {value} : {errorMessage}
        </p>
      </div>
    )
  })

  return (
    <section>
      <ImportFailedMessage>
        Import failed. Please fix the validation errors below (make sure to
        reload the page before you reimport):
      </ImportFailedMessage>
      <ErrorSection>{errorMessages}</ErrorSection>
    </section>
  )
}

export default ErrorMessageSection
