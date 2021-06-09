import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import MarketBaskets from './MarketBaskets'
import MarketBasketDetail from './MarketBaskets/MarketBasketDetail'

import SANDBOX_MarketBaskets from './SANDBOX_MarketBaskets'
import SANDBOX_MarketBasketDetail from './SANDBOX_MarketBaskets/MarketBasketDetail'
import SANDBOX_Stakeholders from './SANDBOX_Stakeholders'
import SANDBOX_Roles from './SANDBOX_Roles'
import SANDBOX_RoleSpecialties from './SANDBOX_RoleSpecialties'

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
    <Route
      exact={true}
      path={'/orion/specialized/value-perception/sandbox-stakeholders'}
      component={SANDBOX_Stakeholders}
    />
    <Route
      exact={true}
      path={'/orion/specialized/value-perception/sandbox-roles'}
      component={SANDBOX_Roles}
    />
    <Route
      exact={true}
      path={'/orion/specialized/value-perception/sandbox-role-specialties'}
      component={SANDBOX_RoleSpecialties}
    />
    <Redirect to={'/orion/specialized/value-perception/market-baskets'} />
  </Switch>
)

export default ValuePerception
