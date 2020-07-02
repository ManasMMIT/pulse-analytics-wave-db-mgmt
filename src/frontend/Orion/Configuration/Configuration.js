import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { useAuth0 } from '../../../react-auth0-spa'
import superUsersById from '../../utils/super-users'

import People from './People'
import ProductsIndications from './ProductsIndications'
import AdminSettings from './AdminSettings'

const Configuration = () => {
  const { user } = useAuth0()
  const isSuperUser = user.sub in superUsersById

  return (
    <Switch>
      <Route path={'/orion/configuration/people'} component={People} />
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
      <Redirect to="/orion/configuration/people" />
    </Switch>
  )
}

export default Configuration
