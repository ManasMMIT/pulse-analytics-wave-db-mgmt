import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { useAuth0 } from '../../../react-auth0-spa'
import superUsersById from '../../utils/super-users'

import MarketBaskets from './MarketBaskets'
import MarketBasketDetail from './MarketBaskets/MarketBasketDetail'
import People from './People'
import UsStates from './UsStates'
import ProductsIndications from './ProductsIndications'
import AdminSettings from './AdminSettings'
import DevToProdPushConsole from './DevToProdPushConsole'

const Configuration = () => {
  const { user } = useAuth0()
  const isSuperUser = user.sub in superUsersById

  return (
    <Switch>
      <Route exact={true} path={'/orion/configuration/market-baskets'} component={MarketBaskets} />
      <Route path={'/orion/configuration/market-baskets/:marketBasketId'} component={MarketBasketDetail} />
      <Route path={'/orion/configuration/market-baskets'} component={MarketBaskets} />
      <Route path={'/orion/configuration/people'} component={People} />
      <Route path={'/orion/configuration/us-states'} component={UsStates} />
      <Route
        path={'/orion/configuration/products-indications'}
        component={ProductsIndications}
      />
      {isSuperUser && (
        <Route
          path={'/orion/configuration/admin-settings'}
          component={AdminSettings}
        />
      )}
      <Route
        path="/orion/configuration/dev-to-prod-push-console"
        component={DevToProdPushConsole}
      />
      <Redirect to="/orion/configuration/market-baskets" />
    </Switch>
  )
}

export default Configuration
