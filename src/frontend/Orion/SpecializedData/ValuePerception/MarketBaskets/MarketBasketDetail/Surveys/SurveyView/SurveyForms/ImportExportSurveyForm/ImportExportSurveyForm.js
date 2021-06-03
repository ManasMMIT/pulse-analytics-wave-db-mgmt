import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Button } from '@pulse-analytics/pulse-design-system'

import Dialog from 'frontend/components/Dialog'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

import ExportSurveySection from './ExportSurveySection'
import ImportSurveySection from './ImportSurveySection'

import { ModalHeader, BlueText } from '../utils'

const HeaderSection = styled.section({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: Spacing.S7,
  borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
})

const contentWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const ImportExportSurveyForm = ({
  surveyDate,
  surveyId,
  marketBasketName,
  closeHandler,
}) => (
  <Dialog
    contentWrapperStyle={contentWrapperStyle}
    contentStyle={{
      height: '80%',
      width: '65%',
    }}
  >
    <HeaderSection>
      <ModalHeader>
        Import/Export Data: <BlueText>{surveyDate} Survey</BlueText>
      </ModalHeader>
      <Button
        type="ghost"
        onClick={closeHandler}
        style={{
          background: transparentize(0.85, Color.GRAY_DARK),
          color: Color.GRAY_DARK,
          padding: `${Spacing.S2} ${Spacing.S3}`,
          margin: `${Spacing.S4} 6px`,
          ...FontSpace.FS2,
        }}
      >
        Close X
      </Button>
    </HeaderSection>
    <section style={{ display: 'flex', height: '100%' }}>
      <ExportSurveySection
        surveyId={surveyId}
        marketBasketName={marketBasketName}
        surveyDate={surveyDate}
      />
      <ImportSurveySection surveyId={surveyId} />
    </section>
  </Dialog>
)

ImportExportSurveyForm.propTypes = {
  surveyDate: PropTypes.string.isRequired,
  surveyId: PropTypes.string.isRequired,
  marketBasketName: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default ImportExportSurveyForm
