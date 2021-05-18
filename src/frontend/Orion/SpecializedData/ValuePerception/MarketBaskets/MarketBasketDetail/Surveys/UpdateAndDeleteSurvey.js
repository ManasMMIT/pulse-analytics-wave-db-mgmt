import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_MARKET_BASKETS_SURVEYS } from 'frontend/api/queries'
import {
  UPDATE_MARKET_BASKET_SURVEY,
  DELETE_MARKET_BASKET_SURVEY,
} from 'frontend/api/mutations'

import Input from 'frontend/components/Input'

const UpdateAndDeleteSurvey = ({ marketBasketId, marketBasketSurveyId }) => {
  const [stagedDate, setDate] = useState()

  const [updateMarketBasketSurvey] = useMutation(UPDATE_MARKET_BASKET_SURVEY, {
    variables: {
      input: {
        id: marketBasketSurveyId,
        date: new Date(stagedDate),
      },
    },
    update: (cache, { data: { updateMarketBasketSurvey } }) => {
      const { marketBasketsSurveys } = cache.readQuery({
        query: GET_MARKET_BASKETS_SURVEYS,
        variables: { marketBasketId },
      })
      const updateMarketBasketsSurveyIndex = marketBasketsSurveys.indexOf(
        ({ id }) => id === marketBasketSurveyId
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
  })

  const [deleteMarketBasketSurvey] = useMutation(DELETE_MARKET_BASKET_SURVEY, {
    variables: { input: { id: marketBasketSurveyId } },
    update: (cache) => {
      const { marketBasketsSurveys } = cache.readQuery({
        query: GET_MARKET_BASKETS_SURVEYS,
        variables: { marketBasketId },
      })
      const newMarketBasketsSurveys = marketBasketsSurveys.filter(
        ({ id }) => id !== marketBasketSurveyId
      )
      cache.writeQuery({
        query: GET_MARKET_BASKETS_SURVEYS,
        data: { marketBasketsSurveys: newMarketBasketsSurveys },
        variables: { marketBasketId },
      })
    },
    onError: alert,
  })

  return (
    <div>
      <Input
        name="updateMarketBasketSurveyDate"
        type="date"
        value={stagedDate}
        onChange={({ value }) => setDate(value)}
        style={{ width: 250 }}
      />
      <Button onClick={updateMarketBasketSurvey}>
        Update Market Basket Survey
      </Button>
      <Button onClick={deleteMarketBasketSurvey}>
        Delete Market Basket Survey
      </Button>
    </div>
  )
}

export default UpdateAndDeleteSurvey
