import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_MARKET_BASKETS_SURVEYS } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import Dialog from 'frontend/components/Dialog'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

import PersonSection from './PersonSection'
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

const CreateStakeholderForm = ({
  surveyDate,
  surveyId,
  closeHandler,
  marketBasketId,
  marketBasketName,
}) => {
  const {
    data: marketBasketSurveyData,
    loading: marketBasketSurveyLoading,
  } = useQuery(GET_MARKET_BASKETS_SURVEYS, {
    variables: { marketBasketId },
  })

  const surveyData = marketBasketSurveyData.marketBasketsSurveys.find(
    ({ id }) => id === surveyId
  )

  return (
    <Dialog
      contentWrapperStyle={contentWrapperStyle}
      contentStyle={{
        width: '80%',
      }}
    >
      <HeaderSection>
        <ModalHeader>
          Add Stakeholder Person to <BlueText>{marketBasketName}</BlueText>{' '}
          Market Basket: <BlueText>{surveyDate}</BlueText> Survey
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
      {marketBasketSurveyLoading ? (
        <Spinner />
      ) : (
        <div style={{ padding: Spacing.S7, overflow: 'auto', height: '100%' }}>
          <PersonSection surveyId={surveyId} surveyData={surveyData} />
        </div>
      )}
    </Dialog>
  )
}

CreateStakeholderForm.propTypes = {
  surveyDate: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
  marketBasketId: PropTypes.string.isRequired,
  marketBasketName: PropTypes.string.isRequired,
  surveyId: PropTypes.string.isRequired,
}

export default CreateStakeholderForm
