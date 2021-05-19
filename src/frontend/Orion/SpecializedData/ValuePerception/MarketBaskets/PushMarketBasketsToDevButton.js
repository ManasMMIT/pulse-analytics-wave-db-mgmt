import React from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'

import { PUSH_MARKET_BASKETS_TO_DEV } from 'frontend/api/mutations'

import { Button } from '@pulse-analytics/pulse-design-system'
import Spinner from 'frontend/components/Spinner'

const buttonStyle = {
  fontFamily: 'inherit',
  margin: 12,
  padding: '4px 6px',
}

const PushMarketBasketsToDevButton = () => {
  const { marketBasketId } = useParams()
  const [pushIt, { loading }] = useMutation(PUSH_MARKET_BASKETS_TO_DEV, {
    variables: { input: { marketBasketId } },
    onCompleted: () => alert('Market Basket Push Completed.'),
    onError: alert,
  })

  const buttonText = marketBasketId ? 'Stage Data' : 'Stage All Data'

  if (loading)
    return (
      <Button style={buttonStyle} onClick={() => {}} type="ghost">
        <Spinner />
      </Button>
    )
  return (
    <Button style={buttonStyle} onClick={pushIt} type="secondary">
      {buttonText}
    </Button>
  )
}

export default PushMarketBasketsToDevButton
