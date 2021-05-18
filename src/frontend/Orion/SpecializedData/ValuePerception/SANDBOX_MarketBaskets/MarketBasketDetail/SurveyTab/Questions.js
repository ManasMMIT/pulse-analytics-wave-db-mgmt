import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_MARKET_BASKETS_SURVEYS_QUESTIONS } from 'frontend/api/queries'

const Questions = ({ surveyId }) => {
  const { data: marketBasketsSurveysQuestions, loading } = useQuery(
    GET_MARKET_BASKETS_SURVEYS_QUESTIONS,
    {
      variables: { surveyId },
    }
  )

  if (loading) return null

  return (
    <>
      {marketBasketsSurveysQuestions.marketBasketsSurveysQuestions.map(
        ({ id, category, characteristic, answers }) => (
          <div key={id}>
            {category.name} - {characteristic.name}
            {answers.map(
              ({ id, rating, stakeholder: { first_name, last_name } }) => (
                <div key={id} style={{ marginLeft: 10 }}>
                  {first_name} {last_name} - {rating}
                </div>
              )
            )}
          </div>
        )
      )}
    </>
  )
}

export default Questions
