import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_MARKET_BASKETS_SURVEYS } from 'frontend/api/queries'
import { CREATE_MARKET_BASKET_SURVEY } from 'frontend/api/mutations'

import Input from 'frontend/components/Input'

import Questions from './Questions'
import UpdateAndDeleteSurvey from './UpdateAndDeleteSurvey'

const Surveys = ({ marketBasket }) => {
  const [stagedDate, setDate] = useState()

  const { data: marketBasketsSurveys, loading } = useQuery(
    GET_MARKET_BASKETS_SURVEYS,
    {
      variables: { marketBasketId: marketBasket.id },
    }
  )

  const [createMarketBasket] = useMutation(CREATE_MARKET_BASKET_SURVEY, {
    variables: {
      input: {
        market_basket: marketBasket.id,
        date: new Date(stagedDate),
      },
    },
    update: (cache, { data: { createMarketBasketSurvey } }) => {
      const newMarketBasketsSurveys = [
        ...marketBasketsSurveys.marketBasketsSurveys,
        createMarketBasketSurvey,
      ]
      cache.writeQuery({
        query: GET_MARKET_BASKETS_SURVEYS,
        data: { marketBasketsSurveys: newMarketBasketsSurveys },
        variables: { marketBasketId: marketBasket.id },
      })
    },
    onError: alert,
  })

  if (loading) return null

  return (
    <div>
      <Input
        name="createMarketBasketSurveyDate"
        type="date"
        value={stagedDate}
        onChange={({ value }) => setDate(value)}
        style={{ width: 250 }}
      />
      <Button onClick={createMarketBasket}>Create Market Baset Survey</Button>
      {marketBasketsSurveys.marketBasketsSurveys.map(({ id, date }) => (
        <div key={id}>
          Date: {date}
          <UpdateAndDeleteSurvey
            marketBasketId={marketBasket.id}
            marketBasketSurveyId={id}
          />
          <div style={{ marginLeft: 10 }}>
            <Questions surveyId={id} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Surveys
