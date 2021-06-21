import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_MARKET_BASKETS_SURVEYS } from 'frontend/api/queries'
import { DELETE_MARKET_BASKET_SURVEY } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'
import { SingleActionDialog } from 'frontend/components/Dialog'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

const BoldText = styled.span({
  fontWeight: 700,
})

const DeleteSurveySection = ({
  surveyId,
  surveyDate,
  marketBasketId,
  marketBasketName,
  closeHandler,
  setSurvey,
}) => {
  const [isModalOpen, setModal] = useState(false)

  const [deleteMarketBasketSurvey, { loading: mutationLoading }] = useMutation(
    DELETE_MARKET_BASKET_SURVEY,
    {
      variables: { input: { id: surveyId } },
      update: (cache) => {
        const { marketBasketsSurveys } = cache.readQuery({
          query: GET_MARKET_BASKETS_SURVEYS,
          variables: { marketBasketId },
        })
        const newMarketBasketsSurveys = marketBasketsSurveys.filter(
          ({ id }) => id !== surveyId
        )
        cache.writeQuery({
          query: GET_MARKET_BASKETS_SURVEYS,
          data: { marketBasketsSurveys: newMarketBasketsSurveys },
          variables: { marketBasketId },
        })
      },
      onError: alert,
      onCompleted: () => {
        setSurvey(undefined)
      },
    }
  )

  return (
    <section>
      <h4 style={{ paddingBottom: Spacing.FS4, ...FontSpace.FS5 }}>
        Delete Survey
      </h4>
      <p style={FontSpace.FS2}>
        Deleting a survey removes all data associated with it and can’t be
        undone.
      </p>
      <Button
        color={Color.RED}
        onClick={() => setModal(true)}
        style={{
          padding: `${Spacing.S2} ${Spacing.S3}`,
          margin: `${Spacing.S4} 0`,
        }}
      >
        Delete Survey
      </Button>
      {isModalOpen && (
        <SingleActionDialog
          header="Delete Survey"
          submitText="Delete Forever"
          submitHandler={deleteMarketBasketSurvey}
          cancelHandler={closeHandler}
          headerStyle={{ color: Color.RED }}
          submitColor={Color.RED}
          contentStyle={{ width: 450 }}
        >
          {mutationLoading ? (
            <Spinner />
          ) : (
            <div style={{ padding: 36, textAlign: 'center', ...FontSpace.FS3 }}>
              <p>
                Are you sure you want to delete the
                <BoldText> {surveyDate}</BoldText> Survey from the
                <BoldText> {marketBasketName}</BoldText> Market Basket? This
                will delete all stakeholder survey data, from this Survey. Other
                surveys will remain unchanged.
              </p>
              <p style={{ fontWeight: 700, marginTop: 12 }}>
                THIS CANNOT BE UNDONE
              </p>
            </div>
          )}
        </SingleActionDialog>
      )}
    </section>
  )
}

DeleteSurveySection.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  surveyId: PropTypes.string.isRequired,
  surveyDate: PropTypes.string.isRequired,
  marketBasketId: PropTypes.string.isRequired,
  marketBasketName: PropTypes.string.isRequired,
  setSurvey: PropTypes.func.isRequired,
}

export default DeleteSurveySection
