import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import MarketBaskets from './MarketBaskets'
import MarketBasketDetail from './MarketBaskets/MarketBasketDetail'

import SANDBOX_MarketBaskets from './SANDBOX_MarketBaskets'
import SANDBOX_MarketBasketDetail from './SANDBOX_MarketBaskets/MarketBasketDetail'

const ValuePerception = () => (
  <Switch>
    <Route
      path={
        '/orion/specialized/value-perception/market-baskets/:marketBasketId'
      }
      component={MarketBasketDetail}
    />
    <Route
      path={'/orion/specialized/value-perception/market-baskets'}
      component={MarketBaskets}
    />
    <Route
      exact={true}
      path={'/orion/specialized/value-perception/sandbox-market-baskets'}
      component={SANDBOX_MarketBaskets}
    />
    <Route
      path={
        '/orion/specialized/value-perception/sandbox-market-baskets/:marketBasketId'
      }
      component={SANDBOX_MarketBasketDetail}
    />
    <Redirect to={'/orion/specialized/value-perception/market-baskets'} />
  </Switch>
)

export default ValuePerception
