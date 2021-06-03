import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import { zonedTimeToUtc } from 'date-fns-tz'

import { GET_MARKET_BASKETS_SURVEYS } from 'frontend/api/queries'
import { UPDATE_MARKET_BASKET_SURVEY } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Input from 'frontend/components/Input'
import Spinner from 'frontend/components/Spinner'

import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

import DeleteSurveySection from './DeleteSurveySection'

import { InputSection, FormLabel, BlueText } from '../utils'

const getHeaderTitle = (date) => (
  <p>
    Edit <BlueText>{date}</BlueText> Survey
  </p>
)

const DEFAULT_TIMEZONE = 'America/New_York'

const EditSurveyModal = ({
  surveyId,
  surveyDate,
  marketBasketId,
  marketBasketName,
  closeHandler,
  setSurvey,
}) => {
  const [dateData, setDateData] = useState()

  const [updateMarketBasketSurvey, { loading: mutationLoading }] = useMutation(
    UPDATE_MARKET_BASKET_SURVEY,
    {
      variables: {
        input: {
          id: surveyId,
          date: zonedTimeToUtc(dateData, DEFAULT_TIMEZONE),
        },
      },
      update: (cache, { data: { updateMarketBasketSurvey } }) => {
        const { marketBasketsSurveys } = cache.readQuery({
          query: GET_MARKET_BASKETS_SURVEYS,
          variables: { marketBasketId },
        })
        const updateMarketBasketsSurveyIndex = marketBasketsSurveys.indexOf(
          ({ id }) => id === surveyId
        )
        marketBasketsSurveys[
          updateMarketBasketsSurveyIndex
        ] = updateMarketBasketSurvey
        cache.writeQuery({
          query: GET_MARKET_BASKETS_SURVEYS,
          data: { marketBasketsSurveys: marketBasketsSurveys },
          variables: { marketBasketId },
        })
      },
      onError: alert,
      onCompleted: () => {
        closeHandler()
      },
    }
  )

  const dialogHeader = getHeaderTitle(surveyDate)

  return (
    <SingleActionDialog
      header={dialogHeader}
      submitText="Update Survey"
      submitHandler={updateMarketBasketSurvey}
      cancelHandler={closeHandler}
    >
      <div style={{ padding: Spacing.S7 }}>
        {mutationLoading ? (
          <Spinner />
        ) : (
          <div>
            <h4 style={FontSpace.FS5}>Survey Date</h4>
            <p style={FontSpace.FS2}>
              Update the survey date under the
              <span style={{ fontWeight: 700 }}> {marketBasketName}</span>{' '}
              Market Basket
            </p>
            <form>
              <InputSection>
                <FormLabel>Date (required)</FormLabel>
                <Input
                  name="date"
                  type="date"
                  value={dateData}
                  onChange={({ value }) => setDateData(value)}
                />
              </InputSection>
            </form>
            <DeleteSurveySection
              surveyId={surveyId}
              surveyDate={surveyDate}
              marketBasketId={marketBasketId}
              marketBasketName={marketBasketName}
              closeHandler={closeHandler}
              setSurvey={setSurvey}
            />
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

EditSurveyModal.propTypes = {
  surveyId: PropTypes.string.isRequired,
  surveyDate: PropTypes.string.isRequired,
  marketBasketId: PropTypes.string.isRequired,
  marketBasketName: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
  setSurvey: PropTypes.func.isRequired,
}

export default EditSurveyModal
