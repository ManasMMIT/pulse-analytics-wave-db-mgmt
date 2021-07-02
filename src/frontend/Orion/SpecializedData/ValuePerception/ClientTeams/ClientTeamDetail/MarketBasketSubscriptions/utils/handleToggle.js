const handleToggle = (
  e,
  {
    subscriptions,
    subscribeToMarketBasket,
    unsubscribeToMarketBasket,
    clientTeamId,
  }
) => {
  e.stopPropagation()
  const { checked, value } = e.target

  if (checked) {
    const input = {
      team: clientTeamId,
      market_basket: value,
    }

    subscribeToMarketBasket({ variables: { input } })
  } else {
    const subscriptionToRemove = subscriptions.find(
      ({ market_basket }) => market_basket === value
    )
    const input = { id: subscriptionToRemove.id }

    unsubscribeToMarketBasket({ variables: { input } })
  }
}

export default handleToggle
