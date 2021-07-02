import React from 'react'

import { Button } from '@pulse-analytics/pulse-design-system'
import { useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router'

import { PUSH_TEAM_USER_MARKET_BASKET_SUBSCRIPTIONS } from 'frontend/api/mutations'

const PushToProductionButton = () => {
  const { clientTeamId } = useParams()

  const [push] = useMutation(PUSH_TEAM_USER_MARKET_BASKET_SUBSCRIPTIONS, {
    variables: { input: { clientTeamId } },
    onCompleted: () => alert('push success'),
  })

  return (
    <Button
      type="secondary"
      style={{
        fontFamily: 'inherit',
        margin: 12,
        padding: '0 6px',
      }}
      onClick={push}
    >
      Push Subscriptions to Production
    </Button>
  )
}

export default PushToProductionButton
