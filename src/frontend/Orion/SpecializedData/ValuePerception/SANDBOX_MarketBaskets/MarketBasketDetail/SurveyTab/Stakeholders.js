import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_MARKET_BASKETS_SURVEYS } from 'frontend/api/queries'
import { UPDATE_MARKET_BASKET_SURVEY } from 'frontend/api/mutations'

import StakeholdersSelect from './StakeholdersSelect'

const Stakeholders = ({ surveyId }) => {
  const { data, loading } = useQuery(GET_MARKET_BASKETS_SURVEYS, {
    variables: { surveyId },
  })

  const [updateStakeholders] = useMutation(UPDATE_MARKET_BASKET_SURVEY, {
    onError: alert,
  })

  const removeStakeholder = (stakeholderId, stakeholders) => {
    const newStakeholders = stakeholders.filter((id) => id !== stakeholderId)

    updateStakeholders({
      variables: {
        input: {
          id: surveyId,
          stakeholders: newStakeholders,
        },
      },
    })
  }

  if (loading) return <div>Loading...</div>

  const marketBasketSurvey = data.marketBasketsSurveys[0]

  return (
    <>
      <h3>Stakeholders</h3>
      <StakeholdersSelect
        surveyId={surveyId}
        stakeholders={marketBasketSurvey.stakeholders}
        updateStakeholders={updateStakeholders}
      />
      <div style={{ marginLeft: 10 }}>
        {marketBasketSurvey.stakeholders_full.map(
          ({ id, first_name, last_name }) => (
            <div>
              {`${first_name}  ${last_name}`}
              <Button
                onClick={() =>
                  removeStakeholder(id, marketBasketSurvey.stakeholders)
                }
              >
                Remove
              </Button>
            </div>
          )
        )}
      </div>
    </>
  )
}

export default Stakeholders
