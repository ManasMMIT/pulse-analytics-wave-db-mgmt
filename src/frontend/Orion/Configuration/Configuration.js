import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import AdminSettings from './AdminSettings'
import ProductsIndications from './ProductsIndications'

const Configuration = () => (
  <Switch>
    <Route path={'/orion/configuration/products-indications'} component={ProductsIndications} />
    <Route path={'/orion/configuration/admin-settings'} component={AdminSettings} />
    <Redirect to="/orion/configuration/products-indications" />
  </Switch>
)

export default Configuration
