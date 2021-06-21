import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import { zonedTimeToUtc } from 'date-fns-tz'

import { GET_MARKET_BASKETS_SURVEYS } from 'frontend/api/queries'
import { CREATE_MARKET_BASKET_SURVEY } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

import MarketBasketContext from '../MarketBasketContext'

const InputSection = styled.section({
  display: 'flex',
  flexDirection: 'column',
  padding: `${Spacing.S4} 0`,
})

const FormLabel = styled.label({
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '20px',
  padding: `${Spacing.S3} 0`,
})

const DEFAULT_TIMEZONE = 'America/New_York'

const CreateSurveyModal = ({ closeModal, marketBasketsSurveys, setSurvey }) => {
  const { marketBasketId, marketBasketName } = useContext(MarketBasketContext)

  const [dateData, setDateData] = useState()

  const [createMarketBasket, { loading: mutationLoading }] = useMutation(
    CREATE_MARKET_BASKET_SURVEY,
    {
      variables: {
        input: {
          market_basket: marketBasketId,
          date: zonedTimeToUtc(dateData, DEFAULT_TIMEZONE),
        },
      },
      update: (cache, { data: { createMarketBasketSurvey } }) => {
        const newMarketBasketsSurveys = [
          ...marketBasketsSurveys,
          createMarketBasketSurvey,
        ]

        cache.writeQuery({
          query: GET_MARKET_BASKETS_SURVEYS,
          data: { marketBasketsSurveys: newMarketBasketsSurveys },
          variables: { marketBasketId },
        })
      },
      onError: alert,
      onCompleted: ({ createMarketBasketSurvey }) => {
        closeModal()
        setSurvey(createMarketBasketSurvey.id)
      },
    }
  )

  return (
    <SingleActionDialog
      header="Create New Survey"
      submitText="Create Survey"
      submitHandler={createMarketBasket}
      cancelHandler={closeModal}
    >
      <div style={{ padding: Spacing.S7 }}>
        {mutationLoading ? (
          <Spinner />
        ) : (
          <div>
            <h4 style={FontSpace.FS5}>Select Survey Date</h4>
            <p style={FontSpace.FS2}>
              Create a new survey under the
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
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

CreateSurveyModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  marketBasketsSurveys: PropTypes.array.isRequired,
  setSurvey: PropTypes.func.isRequired,
}

export default CreateSurveyModal
